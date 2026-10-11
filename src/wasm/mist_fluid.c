#define GW 96
#define GH 54
#define CELLS (GW * GH)
#define MAX_PARTICLES 1400

#define IX(i, j) ((i) + (j) * GW)

static float u[CELLS];
static float v[CELLS];
static float u_prev[CELLS];
static float v_prev[CELLS];
static float dens[CELLS];
static float dens_prev[CELLS];
static float curl[CELLS];

static unsigned int rgba[CELLS];

typedef struct {
    float rest_x;
    float rest_y;
    float x;
    float y;
    float vx;
    float vy;
} Particle;

static Particle particles[MAX_PARTICLES];
static int particle_count = 0;
static int grid_cols = 0;
static int grid_rows = 0;

static inline float fast_abs(float x) {
    return __builtin_fabsf(x);
}

static inline float fast_sqrt(float x) {
    return __builtin_sqrtf(x);
}

static inline float fast_sin(float x) {
    while (x < -3.14159265f) x += 6.2831853f;
    while (x >  3.14159265f) x -= 6.2831853f;
    float ax = fast_abs(x);
    float p_ax = 3.14159265f - ax;
    float num = 16.0f * x * p_ax;
    float den = 49.348022f - 4.0f * ax * p_ax;
    return num / den;
}

static inline float fast_cos(float x) {
    return fast_sin(x + 1.57079632f);
}

static inline float clampf(float val, float min, float max) {
    if (val < min) return min;
    if (val > max) return max;
    return val;
}

static void set_bnd(int b, float *x) {
    for (int i = 1; i < GW - 1; i++) {
        x[IX(i, 0)]      = (b == 2) ? -x[IX(i, 1)] : x[IX(i, 1)];
        x[IX(i, GH - 1)] = (b == 2) ? -x[IX(i, GH - 2)] : x[IX(i, GH - 2)];
    }
    for (int j = 1; j < GH - 1; j++) {
        x[IX(0, j)]      = (b == 1) ? -x[IX(1, j)] : x[IX(1, j)];
        x[IX(GW - 1, j)] = (b == 1) ? -x[IX(GW - 2, j)] : x[IX(GW - 2, j)];
    }
    x[IX(0, 0)]           = 0.5f * (x[IX(1, 0)] + x[IX(0, 1)]);
    x[IX(0, GH - 1)]      = 0.5f * (x[IX(1, GH - 1)] + x[IX(0, GH - 2)]);
    x[IX(GW - 1, 0)]      = 0.5f * (x[IX(GW - 2, 0)] + x[IX(GW - 1, 1)]);
    x[IX(GW - 1, GH - 1)] = 0.5f * (x[IX(GW - 2, GH - 1)] + x[IX(GW - 1, GH - 2)]);
}

static void lin_solve(int b, float *x, float *x0, float a, float c, int iters) {
    float c_recip = 1.0f / c;
    for (int k = 0; k < iters; k++) {
        for (int j = 1; j < GH - 1; j++) {
            for (int i = 1; i < GW - 1; i++) {
                x[IX(i, j)] = (x0[IX(i, j)] + a * (x[IX(i - 1, j)] + x[IX(i + 1, j)] +
                                                   x[IX(i, j - 1)] + x[IX(i, j + 1)])) * c_recip;
            }
        }
        set_bnd(b, x);
    }
}

static void diffuse(int b, float *x, float *x0, float diff, float dt) {
    float a = dt * diff * ((GW - 2) * (GH - 2));
    lin_solve(b, x, x0, a, 1.0f + 4.0f * a, 8);
}

static void advect(int b, float *d, float *d0, float *velocX, float *velocY, float dt) {
    float dtx = dt * (GW - 2);
    float dty = dt * (GH - 2);

    for (int j = 1; j < GH - 1; j++) {
        for (int i = 1; i < GW - 1; i++) {
            float x = (float)i - dtx * velocX[IX(i, j)];
            float y = (float)j - dty * velocY[IX(i, j)];

            x = clampf(x, 0.5f, (float)(GW - 2) + 0.5f);
            y = clampf(y, 0.5f, (float)(GH - 2) + 0.5f);

            int i0 = (int)x;
            int i1 = i0 + 1;
            int j0 = (int)y;
            int j1 = j0 + 1;

            float s1 = x - (float)i0;
            float s0 = 1.0f - s1;
            float t1 = y - (float)j0;
            float t0 = 1.0f - t1;

            d[IX(i, j)] = s0 * (t0 * d0[IX(i0, j0)] + t1 * d0[IX(i0, j1)]) +
                          s1 * (t0 * d0[IX(i1, j0)] + t1 * d0[IX(i1, j1)]);
        }
    }
    set_bnd(b, d);
}

static void project(float *velocX, float *velocY, float *p, float *div, int iters) {
    float hx = 1.0f / (float)GW;
    float hy = 1.0f / (float)GH;

    for (int j = 1; j < GH - 1; j++) {
        for (int i = 1; i < GW - 1; i++) {
            div[IX(i, j)] = -0.5f * (hx * (velocX[IX(i + 1, j)] - velocX[IX(i - 1, j)]) +
                                     hy * (velocY[IX(i, j + 1)] - velocY[IX(i, j - 1)]));
            p[IX(i, j)] = 0.0f;
        }
    }
    set_bnd(0, div);
    set_bnd(0, p);

    lin_solve(0, p, div, 1.0f, 4.0f, iters);

    for (int j = 1; j < GH - 1; j++) {
        for (int i = 1; i < GW - 1; i++) {
            velocX[IX(i, j)] -= 0.5f * (p[IX(i + 1, j)] - p[IX(i - 1, j)]) / hx;
            velocY[IX(i, j)] -= 0.5f * (p[IX(i, j + 1)] - p[IX(i, j - 1)]) / hy;
        }
    }
    set_bnd(1, velocX);
    set_bnd(2, velocY);
}

// Vorticity confinement: maintains swirling eddies without numerical dissipation
static void vorticity_confinement(float *velocX, float *velocY, float dt) {
    for (int j = 1; j < GH - 1; j++) {
        for (int i = 1; i < GW - 1; i++) {
            float dw_dy = (velocX[IX(i, j + 1)] - velocX[IX(i, j - 1)]) * 0.5f;
            float dv_dx = (velocY[IX(i + 1, j)] - velocY[IX(i - 1, j)]) * 0.5f;
            curl[IX(i, j)] = dv_dx - dw_dy;
        }
    }

    float eps = 0.35f * dt;
    for (int j = 2; j < GH - 2; j++) {
        for (int i = 2; i < GW - 2; i++) {
            float dx = (fast_abs(curl[IX(i + 1, j)]) - fast_abs(curl[IX(i - 1, j)])) * 0.5f;
            float dy = (fast_abs(curl[IX(i, j + 1)]) - fast_abs(curl[IX(i, j - 1)])) * 0.5f;
            float len = fast_sqrt(dx * dx + dy * dy) + 1e-5f;
            dx /= len;
            dy /= len;

            float c = curl[IX(i, j)];
            velocX[IX(i, j)] += eps * (dy * c);
            velocY[IX(i, j)] -= eps * (dx * c);
        }
    }
}

__attribute__((export_name("init")))
void init(int is_dark) {
    for (int i = 0; i < CELLS; i++) {
        u[i] = 0.0f;
        v[i] = 0.0f;
        u_prev[i] = 0.0f;
        v_prev[i] = 0.0f;
        dens[i] = 0.0f;
        dens_prev[i] = 0.0f;
        rgba[i] = 0;
    }
    // Seed initial gentle mist clouds
    for (int j = 3; j < GH - 3; j++) {
        for (int i = 3; i < GW - 3; i++) {
            float fx = (float)i / (float)GW;
            float fy = (float)j / (float)GH;
            float d1 = fast_sin(fx * 6.28f * 1.5f) * fast_cos(fy * 3.14f * 2.0f);
            if (d1 > 0.15f) {
                dens[IX(i, j)] = (d1 - 0.15f) * 0.85f;
            }
        }
    }
}

__attribute__((export_name("add_force")))
void add_force(float norm_x, float norm_y, float force_x, float force_y, float density_amt) {
    int cx = (int)(norm_x * (float)GW);
    int cy = (int)(norm_y * (float)GH);
    int radius = 6;

    for (int dy = -radius; dy <= radius; dy++) {
        int y = cy + dy;
        if (y < 1 || y >= GH - 1) continue;
        for (int dx = -radius; dx <= radius; dx++) {
            int x = cx + dx;
            if (x < 1 || x >= GW - 1) continue;

            float dist2 = (float)(dx * dx + dy * dy);
            float r2 = (float)(radius * radius);
            if (dist2 > r2) continue;

            float falloff = 1.0f - (dist2 / r2);
            int idx = IX(x, y);
            u_prev[idx] += force_x * falloff * 0.35f;
            v_prev[idx] += force_y * falloff * 0.35f;
            dens_prev[idx] += density_amt * falloff * 0.8f;
        }
    }
}

__attribute__((export_name("step")))
void step(float dt, float ambient_time, int is_dark) {
    // 1. Add ambient breathing drift (subtle natural movement)
    for (int j = 4; j < GH - 4; j += 4) {
        for (int i = 4; i < GW - 4; i += 4) {
            int idx = IX(i, j);
            float fx = (float)i / (float)GW;
            float fy = (float)j / (float)GH;
            u_prev[idx] += fast_cos(fy * 6.0f + ambient_time * 0.5f) * 0.035f;
            v_prev[idx] += fast_sin(fx * 5.0f + ambient_time * 0.4f) * 0.025f;
        }
    }

    // Velocity step
    for (int i = 0; i < CELLS; i++) {
        u[i] += dt * u_prev[i];
        v[i] += dt * v_prev[i];
        u_prev[i] = 0.0f;
        v_prev[i] = 0.0f;
    }

    vorticity_confinement(u, v, dt);

    diffuse(1, u_prev, u, 0.00005f, dt);
    diffuse(2, v_prev, v, 0.00005f, dt);
    project(u_prev, v_prev, u, v, 8);

    advect(1, u, u_prev, u_prev, v_prev, dt);
    advect(2, v, v_prev, u_prev, v_prev, dt);
    project(u, v, u_prev, v_prev, 8);

    // Density step
    for (int i = 0; i < CELLS; i++) {
        dens[i] += dt * dens_prev[i];
        dens_prev[i] = 0.0f;
    }
    diffuse(0, dens_prev, dens, 0.0001f, dt);
    advect(0, dens, dens_prev, u, v, dt);

    // Natural decay & clamp
    for (int i = 0; i < CELLS; i++) {
        dens[i] = clampf(dens[i] * 0.985f, 0.0f, 1.5f);
        u[i] *= 0.97f;
        v[i] *= 0.97f;
    }

    // 2. Generate RGBA color palette texture directly in WASM
    // Hero colors: light (#8AA3D6 -> 138, 163, 214 and #FFFFFF -> 255, 255, 255)
    // Dark: softer cyan/emerald (#38bdf8 / #10b981 / #72f0a6)
    for (int i = 0; i < CELLS; i++) {
        float d = dens[i];
        if (d < 0.005f) {
            rgba[i] = 0;
            continue;
        }

        float alpha_f = clampf(d * (is_dark ? 0.35f : 0.45f), 0.0f, 0.85f);
        unsigned int a = (unsigned int)(alpha_f * 255.0f);

        unsigned int r, g, b;
        if (!is_dark) {
            // Light palette: sky blue to soft white
            float mix_w = clampf(d * 1.1f - 0.2f, 0.0f, 1.0f);
            r = (unsigned int)(138.0f * (1.0f - mix_w) + 255.0f * mix_w);
            g = (unsigned int)(163.0f * (1.0f - mix_w) + 255.0f * mix_w);
            b = (unsigned int)(214.0f * (1.0f - mix_w) + 255.0f * mix_w);
        } else {
            // Dark palette: soft luminous mint / cyan
            float mix_w = clampf(d * 1.2f - 0.1f, 0.0f, 1.0f);
            r = (unsigned int)(56.0f * (1.0f - mix_w) + 114.0f * mix_w);
            g = (unsigned int)(189.0f * (1.0f - mix_w) + 240.0f * mix_w);
            b = (unsigned int)(248.0f * (1.0f - mix_w) + 166.0f * mix_w);
        }

        // Little-endian RGBA: 0xAABBGGRR
        rgba[i] = (a << 24) | (b << 16) | (g << 8) | r;
    }
}

__attribute__((export_name("get_rgba_ptr")))
unsigned int* get_rgba_ptr(void) {
    return rgba;
}

__attribute__((export_name("get_grid_width")))
int get_grid_width(void) {
    return GW;
}

__attribute__((export_name("get_grid_height")))
int get_grid_height(void) {
    return GH;
}

// Particle grid simulation functions
__attribute__((export_name("build_grid_particles")))
void build_grid_particles(float width, float height, float spacing) {
    if (spacing <= 10.0f) spacing = 90.0f;
    grid_cols = (int)(width / spacing) + 2;
    grid_rows = (int)(height / spacing) + 2;
    int total = grid_cols * grid_rows;
    if (total > MAX_PARTICLES) {
        float factor = fast_sqrt((float)MAX_PARTICLES / (float)total);
        grid_cols = (int)((float)grid_cols * factor);
        grid_rows = (int)((float)grid_rows * factor);
        total = grid_cols * grid_rows;
    }
    particle_count = total;

    float offsetX = (width - (float)(grid_cols - 1) * spacing) * 0.5f;
    float offsetY = (height - (float)(grid_rows - 1) * spacing) * 0.5f;

    int idx = 0;
    for (int r = 0; r < grid_rows; r++) {
        for (int c = 0; c < grid_cols; c++) {
            float x = offsetX + (float)c * spacing;
            float y = offsetY + (float)r * spacing;
            particles[idx].rest_x = x;
            particles[idx].rest_y = y;
            particles[idx].x = x;
            particles[idx].y = y;
            particles[idx].vx = 0.0f;
            particles[idx].vy = 0.0f;
            idx++;
        }
    }
}

__attribute__((export_name("get_grid_cols")))
int get_grid_cols(void) {
    return grid_cols;
}

__attribute__((export_name("get_grid_rows")))
int get_grid_rows(void) {
    return grid_rows;
}

__attribute__((export_name("update_particles")))
void update_particles(float mouse_x, float mouse_y, float canvas_w, float canvas_h) {
    int has_mouse = (mouse_x >= 0.0f && mouse_y >= 0.0f);
    float inv_w = 1.0f / (canvas_w > 0.0f ? canvas_w : 1.0f);
    float inv_h = 1.0f / (canvas_h > 0.0f ? canvas_h : 1.0f);

    for (int i = 0; i < particle_count; i++) {
        Particle *p = &particles[i];

        // Mouse repulsion
        if (has_mouse) {
            float dx = p->x - mouse_x;
            float dy = p->y - mouse_y;
            float dist2 = dx * dx + dy * dy;
            if (dist2 < 19600.0f && dist2 > 0.1f) { // 140px radius
                float dist = fast_sqrt(dist2);
                float force = (1.0f - dist / 140.0f) * 25.0f;
                p->vx += (dx / dist) * force * 0.12f;
                p->vy += (dy / dist) * force * 0.12f;
            }
        }

        // Fluid advection coupling: sample fluid velocity field at particle location
        int gx = (int)(p->x * inv_w * (float)GW);
        int gy = (int)(p->y * inv_h * (float)GH);
        if (gx >= 0 && gx < GW && gy >= 0 && gy < GH) {
            int g_idx = IX(gx, gy);
            p->vx += u[g_idx] * 0.4f;
            p->vy += v[g_idx] * 0.4f;
        }

        // Spring restitution to rest position
        p->vx += 0.06f * (p->rest_x - p->x);
        p->vy += 0.06f * (p->rest_y - p->y);

        // Damping
        p->vx *= 0.84f;
        p->vy *= 0.84f;

        p->x += p->vx;
        p->y += p->vy;
    }
}

__attribute__((export_name("get_particles_ptr")))
Particle* get_particles_ptr(void) {
    return particles;
}

__attribute__((export_name("get_particle_count")))
int get_particle_count(void) {
    return particle_count;
}
