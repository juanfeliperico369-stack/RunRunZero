/* ===== MOTOR 3D · WebGL1 propio (sin librerías) ===== */
const hex = h => { h = h.replace('#', ''); if (h.length === 3) h = h.replace(/./g, '$&$&'); const n = parseInt(h, 16); return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255]; };
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
const lerp3 = (o, a, b, t) => { o[0] = a[0] + (b[0] - a[0]) * t; o[1] = a[1] + (b[1] - a[1]) * t; o[2] = a[2] + (b[2] - a[2]) * t; return o; };
const ONE = [1, 1, 1];

const M4 = {
  I() { const m = new Float32Array(16); m[0] = m[5] = m[10] = m[15] = 1; return m; },
  persp(o, fy, asp, n, f) {
    const t = 1 / Math.tan(fy / 2), nf = 1 / (n - f); o.fill(0);
    o[0] = t / asp; o[5] = t; o[10] = (f + n) * nf; o[11] = -1; o[14] = 2 * f * n * nf; return o;
  },
  look(o, ex, ey, ez, cx, cy, cz) {
    let zx = ex - cx, zy = ey - cy, zz = ez - cz, l = Math.hypot(zx, zy, zz) || 1; zx /= l; zy /= l; zz /= l;
    let xx = zz, xz = -zx; l = Math.hypot(xx, xz) || 1; xx /= l; xz /= l;
    const yx = zy * xz, yy = zz * xx - zx * xz, yz = -zy * xx;
    o[0] = xx; o[1] = yx; o[2] = zx; o[3] = 0; o[4] = 0; o[5] = yy; o[6] = zy; o[7] = 0;
    o[8] = xz; o[9] = yz; o[10] = zz; o[11] = 0;
    o[12] = -(xx * ex + xz * ez); o[13] = -(yx * ex + yy * ey + yz * ez); o[14] = -(zx * ex + zy * ey + zz * ez); o[15] = 1; return o;
  },
  _t: new Float32Array(16),
  mul(o, a, b) {
    const t = M4._t;
    for (let c = 0; c < 4; c++) {
      const b0 = b[c * 4], b1 = b[c * 4 + 1], b2 = b[c * 4 + 2], b3 = b[c * 4 + 3];
      t[c * 4] = a[0] * b0 + a[4] * b1 + a[8] * b2 + a[12] * b3;
      t[c * 4 + 1] = a[1] * b0 + a[5] * b1 + a[9] * b2 + a[13] * b3;
      t[c * 4 + 2] = a[2] * b0 + a[6] * b1 + a[10] * b2 + a[14] * b3;
      t[c * 4 + 3] = a[3] * b0 + a[7] * b1 + a[11] * b2 + a[15] * b3;
    }
    o.set(t); return o;
  },
  // T * Ry * Rx * Rz * S
  trs(o, x, y, z, ry = 0, rx = 0, rz = 0, kx = 1, ky = kx, kz = kx) {
    const cy = Math.cos(ry), sy = Math.sin(ry), cx = Math.cos(rx), sx = Math.sin(rx), cz = Math.cos(rz), sz = Math.sin(rz);
    const a00 = cy, a01 = sy * sx, a02 = sy * cx, a11 = cx, a12 = -sx, a20 = -sy, a21 = cy * sx, a22 = cy * cx;
    o[0] = (a00 * cz + a01 * sz) * kx; o[1] = (a11 * sz) * kx; o[2] = (a20 * cz + a21 * sz) * kx; o[3] = 0;
    o[4] = (-a00 * sz + a01 * cz) * ky; o[5] = (a11 * cz) * ky; o[6] = (-a20 * sz + a21 * cz) * ky; o[7] = 0;
    o[8] = a02 * kz; o[9] = a12 * kz; o[10] = a22 * kz; o[11] = 0;
    o[12] = x; o[13] = y; o[14] = z; o[15] = 1; return o;
  }
};

/* ---------- Atlas de texturas (Canvas2D → WebGL) ---------- */
const AT = { W: 1024, H: 1024, white: [16 / 1024, 990 / 1024], r: {} };
const WUV = AT.white;

/* ---------- Constructor de mallas low-poly ---------- */
class MB {
  constructor() { this.d = []; this.T = M4.I(); this.st = []; }
  at(x, y, z, ry, rx, rz, kx, ky, kz, fn) {
    const m = M4.trs(new Float32Array(16), x, y, z, ry, rx, rz, kx, ky, kz);
    this.st.push(this.T); this.T = M4.mul(new Float32Array(16), this.T, m); fn(this); this.T = this.st.pop(); return this;
  }
  tp(p) { const m = this.T; return [m[0] * p[0] + m[4] * p[1] + m[8] * p[2] + m[12], m[1] * p[0] + m[5] * p[1] + m[9] * p[2] + m[13], m[2] * p[0] + m[6] * p[1] + m[10] * p[2] + m[14]]; }
  tri(a, b, c, col, e = 0, ta = WUV, tb = WUV, tc = WUV) {
    a = this.tp(a); b = this.tp(b); c = this.tp(c);
    const ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2], vx = c[0] - a[0], vy = c[1] - a[1], vz = c[2] - a[2];
    let nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx; const l = Math.hypot(nx, ny, nz) || 1; nx /= l; ny /= l; nz /= l;
    const d = this.d;
    d.push(a[0], a[1], a[2], nx, ny, nz, col[0], col[1], col[2], e, ta[0], ta[1]);
    d.push(b[0], b[1], b[2], nx, ny, nz, col[0], col[1], col[2], e, tb[0], tb[1]);
    d.push(c[0], c[1], c[2], nx, ny, nz, col[0], col[1], col[2], e, tc[0], tc[1]);
  }
  quad(a, b, c, d, col, e = 0, uv) {
    if (uv) { const [u0, v0, u1, v1] = uv; this.tri(a, b, c, col, e, [u0, v1], [u1, v1], [u1, v0]); this.tri(a, c, d, col, e, [u0, v1], [u1, v0], [u0, v0]); }
    else { this.tri(a, b, c, col, e); this.tri(a, c, d, col, e); }
  }
  box(x, y, z, w, h, dd, col, e = 0) {
    const a = w / 2, b = h / 2, c = dd / 2;
    const p = [[x - a, y - b, z - c], [x + a, y - b, z - c], [x + a, y + b, z - c], [x - a, y + b, z - c], [x - a, y - b, z + c], [x + a, y - b, z + c], [x + a, y + b, z + c], [x - a, y + b, z + c]];
    this.quad(p[4], p[5], p[6], p[7], col, e); this.quad(p[1], p[0], p[3], p[2], col, e);
    this.quad(p[0], p[4], p[7], p[3], col, e); this.quad(p[5], p[1], p[2], p[6], col, e);
    this.quad(p[3], p[7], p[6], p[2], col, e); this.quad(p[0], p[1], p[5], p[4], col, e);
  }
  // cilindro vertical (base en y), r2 = radio superior (cono si 0)
  cyl(x, y, z, r, h, seg, col, e = 0, r2 = r, caps = true) {
    for (let i = 0; i < seg; i++) {
      const a0 = i / seg * Math.PI * 2, a1 = (i + 1) / seg * Math.PI * 2;
      const c0 = Math.cos(a0), s0 = Math.sin(a0), c1 = Math.cos(a1), s1 = Math.sin(a1);
      const b0 = [x + c0 * r, y, z + s0 * r], b1 = [x + c1 * r, y, z + s1 * r], t0 = [x + c0 * r2, y + h, z + s0 * r2], t1 = [x + c1 * r2, y + h, z + s1 * r2];
      if (r2 > 0.0001) this.quad(b0, b1, t1, t0, col, e); else this.tri(b0, b1, t0, col, e);
      if (caps) { this.tri([x, y, z], b1, b0, col, e); if (r2 > 0.0001) this.tri([x, y + h, z], t0, t1, col, e); }
    }
  }
  ico(x, y, z, r, col, e = 0, ky = 1, rng = null, jit = 0) {
    const t = (1 + Math.sqrt(5)) / 2;
    const v = [[-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0], [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t], [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1]].map(p => {
      const l = Math.hypot(p[0], p[1], p[2]); const j = rng ? 1 + (rng() - 0.5) * jit : 1;
      return [x + p[0] / l * r * j, y + p[1] / l * r * ky * j, z + p[2] / l * r * j];
    });
    const f = [[0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11], [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8], [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9], [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]];
    for (const q of f) this.tri(v[q[0]], v[q[1]], v[q[2]], col, e);
  }
  hemi(x, y, z, r, seg, rings, col, e = 0) {
    for (let j = 0; j < rings; j++) {
      const p0 = j / rings * Math.PI / 2, p1 = (j + 1) / rings * Math.PI / 2;
      for (let i = 0; i < seg; i++) {
        const a0 = i / seg * Math.PI * 2, a1 = (i + 1) / seg * Math.PI * 2;
        const P = (a, p) => [x + Math.cos(a) * Math.cos(p) * r, y + Math.sin(p) * r, z + Math.sin(a) * Math.cos(p) * r];
        this.quad(P(a0, p0), P(a1, p0), P(a1, p1), P(a0, p1), col, e);
      }
    }
  }
  // cuña: rampa a lo largo de -z, altura h al final
  wedge(x, z0, w, len, h, col, e = 0) {
    const a = w / 2, z1 = z0 - len;
    const A = [x - a, 0, z0], B = [x + a, 0, z0], C = [x + a, h, z1], D = [x - a, h, z1], E = [x - a, 0, z1], F = [x + a, 0, z1];
    this.quad(A, B, C, D, col, e); this.quad(E, F, C, D, col, e);
    this.tri(A, E, D, col, e); this.tri(B, F, C, col, e);
  }
}

/* ---------- Renderizador ---------- */
const VS = `attribute vec3 aP;attribute vec3 aN;attribute vec4 aC;attribute vec2 aT;
uniform mat4 uM,uV,uP;uniform vec2 uBend;uniform vec4 uHill;uniform float uH0;uniform float uPal;uniform vec3 uTint,uTintE,uK0,uK1,uK2,uK3,uK4;
varying vec3 vN;varying vec3 vC;varying float vE;varying vec2 vT;varying float vD;
void main(){vec4 w=uM*vec4(aP,1.0);if(uHill.w>0.5){float sa=uHill.z-w.z;w.y+=clamp((sa-150.0)/250.0,0.0,1.0)*(6.0*sin(uHill.x-w.z*0.0105)+2.2*sin(uHill.y-w.z*0.027))-uH0;}vec4 v=uV*w;float z=min(v.z,0.0);v.x+=uBend.x*z*z;v.y+=uBend.y*z*z;
gl_Position=uP*v;vN=(uM*vec4(aN,0.0)).xyz;vE=aC.a;vT=aT;vD=-v.z;
float k=aC.r*4.0;vec3 pc=uK0*max(0.0,1.0-abs(k))+uK1*max(0.0,1.0-abs(k-1.0))+uK2*max(0.0,1.0-abs(k-2.0))+uK3*max(0.0,1.0-abs(k-3.0))+uK4*max(0.0,1.0-abs(k-4.0));
vec3 dc=aC.rgb*mix(uTint,uTintE,step(0.5,aC.a));vC=mix(dc,pc*aC.g*uTint,uPal);}`;
const FS = `precision mediump float;uniform sampler2D uTex;uniform vec3 uFog,uL;uniform float uAmb,uSun,uEmit,uAlpha,uCut;uniform vec2 uFogR;
varying vec3 vN;varying vec3 vC;varying float vE;varying vec2 vT;varying float vD;
void main(){vec4 t=texture2D(uTex,vT);if(t.a<uCut)discard;vec3 base=vC*t.rgb;
vec3 n=normalize(vN);if(!gl_FrontFacing)n=-n;float d=max(dot(n,uL),0.0);d=floor(d*4.0+0.5)/4.0;
vec3 c=base*(uAmb*(0.72+0.28*n.y)+uSun*d);c=mix(c,base*1.3,vE*uEmit);
float f=clamp((vD-uFogR.x)/(uFogR.y-uFogR.x),0.0,1.0);c=mix(c,uFog,f*f);gl_FragColor=vec4(c,t.a*uAlpha);}`;
const SVS = `attribute vec2 aP;varying vec2 vU;void main(){vU=aP*0.5+0.5;gl_Position=vec4(aP,0.9999,1.0);}`;
const SFS = `precision mediump float;varying vec2 vU;uniform vec3 uTop,uHor,uSunC,uSun;uniform float uStars,uAsp,uHy,uTime;
void main(){float h=clamp((vU.y-uHy)/(1.0-uHy),0.0,1.0);vec3 c=mix(uHor,uTop,pow(h,0.75));
vec2 p=vec2((vU.x-0.5)*uAsp,vU.y);float sd=length(p-uSun.xy);c=mix(c,uSunC,smoothstep(uSun.z,uSun.z*0.82,sd)*step(0.001,h));
c+=uSunC*0.18*smoothstep(uSun.z*3.5,0.0,sd)*step(0.001,h);
if(uStars>0.0){vec2 g=floor(p*120.0);float r=fract(sin(dot(g,vec2(12.9898,78.233)))*43758.5453);c+=step(0.993,r)*uStars*h*(0.6+0.4*sin(uTime*3.0+r*40.0));}
gl_FragColor=vec4(c,1.0);}`;

const R = {
  gl: null, cv: null, meshes: [], dpr: 1, w: 1, h: 1, lost: false,
  V: M4.I(), P: M4.I(), _m: new Float32Array(16), last: null, U: {}, SU: {},
  init(cv) {
    this.cv = cv;
    const opt = { antialias: false, alpha: false, depth: true, stencil: false, powerPreference: 'default', preserveDrawingBuffer: false };
    const gl = cv.getContext('webgl', opt) || cv.getContext('experimental-webgl', opt);
    if (!gl) return false;
    this.gl = gl;
    cv.addEventListener('webglcontextlost', e => { e.preventDefault(); this.lost = true; }, false);
    cv.addEventListener('webglcontextrestored', () => { this.setup(); this.meshes.forEach(m => this._up(m)); if (this.atlasCanvas) this.texture(this.atlasCanvas); this.lost = false; }, false);
    this.setup(); return true;
  },
  _prog(vs, fs) {
    const gl = this.gl, mk = (t, s) => { const sh = gl.createShader(t); gl.shaderSource(sh, s); gl.compileShader(sh); if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) throw new Error('shader: ' + gl.getShaderInfoLog(sh)); return sh; };
    const p = gl.createProgram(); gl.attachShader(p, mk(gl.VERTEX_SHADER, vs)); gl.attachShader(p, mk(gl.FRAGMENT_SHADER, fs));
    gl.bindAttribLocation(p, 0, 'aP'); gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error('link: ' + gl.getProgramInfoLog(p));
    return p;
  },
  setup() {
    const gl = this.gl;
    this.prog = this._prog(VS, FS); this.sprog = this._prog(SVS, SFS);
    const U = this.U = {}, n = gl.getProgramParameter(this.prog, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < n; i++) { const a = gl.getActiveUniform(this.prog, i); U[a.name] = gl.getUniformLocation(this.prog, a.name); }
    const SU = this.SU = {}, n2 = gl.getProgramParameter(this.sprog, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < n2; i++) { const a = gl.getActiveUniform(this.sprog, i); SU[a.name] = gl.getUniformLocation(this.sprog, a.name); }
    this.A = ['aP', 'aN', 'aC', 'aT'].map(k => gl.getAttribLocation(this.prog, k));
    this.sA = gl.getAttribLocation(this.sprog, 'aP');
    this.sbuf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, this.sbuf); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.disable(gl.CULL_FACE); gl.enable(gl.DEPTH_TEST); gl.depthFunc(gl.LEQUAL);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    this.tex = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, this.tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([255, 255, 255, 255]));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    this.last = null;
  },
  texture(canvas) {
    const gl = this.gl; this.atlasCanvas = canvas; gl.bindTexture(gl.TEXTURE_2D, this.tex);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
  },
  _up(m) { const gl = this.gl; m.b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, m.b); gl.bufferData(gl.ARRAY_BUFFER, m.data, gl.STATIC_DRAW); },
  mesh(mb) { const m = { data: new Float32Array(mb.d), n: mb.d.length / 12, b: null }; this._up(m); this.meshes.push(m); return m; },
  free(m) { if (!m) return; const i = this.meshes.indexOf(m); if (i >= 0) this.meshes.splice(i, 1); this.gl.deleteBuffer(m.b); },
  resize(scale) {
    const d = Math.min(window.devicePixelRatio || 1, 2) * scale; this.dpr = d;
    const w = Math.max(1, Math.round(this.cv.clientWidth * d)), h = Math.max(1, Math.round(this.cv.clientHeight * d));
    if (this.cv.width !== w || this.cv.height !== h) { this.cv.width = w; this.cv.height = h; }
    this.w = w; this.h = h;
  },
  // env: {top,hor,fog,fogR,sun,sunC,stars,amb,sunI,emit,L,bend}
  begin(cam, env, time) {
    const gl = this.gl; if (!gl || this.lost) return false;
    gl.viewport(0, 0, this.w, this.h);
    gl.clearColor(env.hor[0], env.hor[1], env.hor[2], 1); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    const asp = this.w / this.h;
    M4.persp(this.P, cam.fov, asp, 0.1, 400);
    M4.look(this.V, cam.ex, cam.ey, cam.ez, cam.cx, cam.cy, cam.cz);
    // cielo
    gl.useProgram(this.sprog); gl.depthMask(false);
    const S = this.SU;
    gl.uniform3fv(S.uTop, env.top); gl.uniform3fv(S.uHor, env.hor); gl.uniform3fv(S.uSunC, env.sunC);
    gl.uniform3f(S.uSun, env.sun[0], env.sun[1], env.sun[2]); gl.uniform1f(S.uStars, env.stars);
    gl.uniform1f(S.uAsp, asp); gl.uniform1f(S.uHy, env.hy); gl.uniform1f(S.uTime, time);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.sbuf);
    for (let i = 1; i < 4; i++) if (this.A[i] >= 0) gl.disableVertexAttribArray(this.A[i]);
    gl.enableVertexAttribArray(this.sA); gl.vertexAttribPointer(this.sA, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3); gl.depthMask(true);
    // mundo
    gl.useProgram(this.prog); const U = this.U;
    gl.uniformMatrix4fv(U.uP, false, this.P); gl.uniformMatrix4fv(U.uV, false, this.V);
    gl.uniform2f(U.uBend, env.bend[0], env.bend[1]); gl.uniform4f(U.uHill, env.hill[0], env.hill[1], env.hill[2], env.hill[3]); gl.uniform1f(U.uH0, env.h0);
    gl.uniform3fv(U.uFog, env.hor); gl.uniform2f(U.uFogR, env.fogR[0], env.fogR[1]);
    gl.uniform3fv(U.uL, env.L); gl.uniform1f(U.uAmb, env.amb); gl.uniform1f(U.uSun, env.sunI);
    gl.uniform1f(U.uEmit, env.emit); this.emit = env.emit; this._e = env.emit;
    gl.uniform1f(U.uAlpha, 1); gl.uniform1f(U.uCut, 0.5); gl.uniform1f(U.uPal, 0);
    gl.uniform3fv(U.uTint, ONE); gl.uniform3fv(U.uTintE, ONE);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, this.tex); gl.uniform1i(U.uTex, 0);
    for (let i = 0; i < 4; i++) if (this.A[i] >= 0) gl.enableVertexAttribArray(this.A[i]);
    this.last = null; this._tint = null; this._tintE = null; this._pal = 0; this.draws = 0;
    return true;
  },
  pal(on, k) {
    const gl = this.gl, U = this.U; gl.uniform1f(U.uPal, on ? 1 : 0); this._pal = on;
    if (k) { gl.uniform3fv(U.uK0, k[0]); gl.uniform3fv(U.uK1, k[1]); gl.uniform3fv(U.uK2, k[2]); gl.uniform3fv(U.uK3, k[3]); gl.uniform3fv(U.uK4, k[4]); }
  },
  draw(m, M, tint = ONE, tintE = ONE, emit = -1) {
    const gl = this.gl, U = this.U;
    if (this.last !== m) {
      gl.bindBuffer(gl.ARRAY_BUFFER, m.b);
      gl.vertexAttribPointer(this.A[0], 3, gl.FLOAT, false, 48, 0);
      if (this.A[1] >= 0) gl.vertexAttribPointer(this.A[1], 3, gl.FLOAT, false, 48, 12);
      if (this.A[2] >= 0) gl.vertexAttribPointer(this.A[2], 4, gl.FLOAT, false, 48, 24);
      if (this.A[3] >= 0) gl.vertexAttribPointer(this.A[3], 2, gl.FLOAT, false, 48, 40);
      this.last = m;
    }
    if (this._tint !== tint) { gl.uniform3fv(U.uTint, tint); this._tint = tint; }
    if (this._tintE !== tintE) { gl.uniform3fv(U.uTintE, tintE); this._tintE = tintE; }
    const e = emit < 0 ? this.emit : emit; if (e !== this._e) { gl.uniform1f(U.uEmit, e); this._e = e; }
    gl.uniformMatrix4fv(U.uM, false, M);
    gl.drawArrays(gl.TRIANGLES, 0, m.n); this.draws++;
  },
  blend(on, alpha = 1) {
    const gl = this.gl;
    if (on) { gl.enable(gl.BLEND); gl.depthMask(false); gl.uniform1f(this.U.uCut, 0.01); }
    else { gl.disable(gl.BLEND); gl.depthMask(true); gl.uniform1f(this.U.uCut, 0.5); }
    gl.uniform1f(this.U.uAlpha, alpha);
  }
};
