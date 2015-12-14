import scipy.integrate as integrate
import matplotlib.pyplot as plt
import numpy as np
import RungeKuttaSolver 
import math


class System:
    def get_function(this, z, fixP):
        x1, y1, x1dot, y1dot, x2, y2, x2dot, y2dot, x3, y3, x3dot, y3dot = z
        g = -1
        k = 0.05
        
        fx = 100 * (fixP[0] - x3) - 10 * x3dot
        fy = 100 * (fixP[1] - y3) - 10 * y3dot
        
        m11 = -2 * (x1 ** 2 + y1 ** 2)
        m12 = -2 * (x1 ** 2 - x1 * x2 + y1 * (y1 - y2))
        m13 = -2 * (x1 ** 2 - x1 * x3 + y1 * (y1 - y3))
        m21 = 2 * (x1 * (-x1 + x2) + y1 * (-y1 + y2))
        m22 = -4 * ((x1 - x2) ** 2 + (y1 - y2) ** 2)
        m23 = 2 * (-((x1 - x2) * (x1 - x3)) - (y1 - y2) * (y1 - y3))
        m31 = 2 * (-x1 * (x1 - x3) - y1 * (y1 - y3))
        m32 = 2 * (-x1 * (x1 - x3) + x2 * (x1 - x3) - y1 * (y1 - y3) + y2 * (y1 - y3))
        m33 = (-2.02 * x1 ** 2 + 4.04 * x1 * x3 - 2.02 * x3 ** 2 - 2.02 * y1 ** 2 + 4.04 * y1 * y3 - 2.02 * y3 ** 2)
        v11 = -2 * (-(k * x1 * x1dot) + x1dot ** 2 + y1dot ** 2 + y1 * (g - k * y1dot))
        v12 = -2 * (k * x2 * (x1dot - x2dot) + (x1dot - x2dot) ** 2 + k * x1 * (-x1dot + x2dot) + (y1dot - y2dot) * (-(k * y1) + y1dot + k * y2 - y2dot))
        v13 = -2 * (-fx * (x1 - x3) - k * x1dot * (x1 - x3) + (x1dot - x3dot) ** 2 + k * (x1 - x3) * x3dot - 1.*fy * (y1 - y3) + \
                 g * (y1 - y3) - k * y1dot * (y1 - y3) + (y1dot - y3dot) ** 2 + k * (y1 - y3) * y3dot)
        
        denominator = m13 * m22 * m31 - m12 * m23 * m31 \
            - m13 * m21 * m32 + m11 * m23 * m32 \
            + m12 * m21 * m33 - m11 * m22 * m33
                    
        c1 = (m23 * m32 - m22 * m33) * v11 / denominator + (m12 * m33 - m13 * m32) * v12 / denominator + (m13 * m22 - m12 * m23) * v13 / denominator          
        c2 = (m21 * m33 - m23 * m31) * v11 / denominator + (m13 * m31 - m11 * m33) * v12 / denominator + (m11 * m23 - m13 * m21) * v13 / denominator  
        c3 = (m22 * m31 - m21 * m32) * v11 / denominator + (m11 * m32 - m12 * m31) * v12 / denominator + (m12 * m21 - m11 * m22) * v13 / denominator  
        
        # print c1,c2,c3, denominator
        return np.array([x1dot  , y1dot ,
                         - c1 * x1 + c2 * (x2 - x1) + c3 * (x3 - x1) - k * x1dot,
                         g - c1 * y1 + c2 * (y2 - y1) + c3 * (y3 - y1) - k * y1dot,
                         x2dot,
                         y2dot,
                         c2 * (x1 - x2) - k * x2dot,
                         g + c2 * (y1 - y2) - k * y2dot,
                         x3dot,
                         y3dot,
                         fx + 0.01 * c3 * (x1 - x3) - k * x3dot,
                         fy + 0.01 * c3 * (y1 - y3) - k * y3dot])

solver = RungeKuttaSolver.Solver(System())

t = 0
z = np.array([-5, 0, 0, 0, -10, 0, 0, 0, -5, 5, 0, 0])
x1 = []
y1 = []
x2 = []
y2 = []
x3 = []
y3 = []

for i in range(0, 10240):
    dt = 0.01
    t += dt
    z = solver.solve_step(dt, z, [-5 + math.cos(t) , 5 + math.sin(t)])
    # norm = math.sqrt(z[0] * z[0] + z[1] * z[1]) / 5 
    # z = np.array([z[0] / norm, z[1] / norm, z[2], z[3]]);
    x1.append(z[0])
    y1.append(z[1])
    x2.append(z[4])
    y2.append(z[5])
    x3.append(z[8])
    y3.append(z[9])

fig, ax = plt.subplots()
ax.plot(x1, y1, x2, y2, x3, y3)

ax.set_aspect('equal')
plt.grid(True)
plt.show()
