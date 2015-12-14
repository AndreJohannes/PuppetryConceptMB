import math, numpy

# Implementation of a time independend 4th order Runge Kutta solver

class Solver:

    def __init__(self, system):
        self.system = system

    def solve_step(self, step_size, state, anchor):
        system = self.system
        # NOTE: s1, s2, s3, s4 are not part of the integration, they merely represent states that get updated every iteration
        k1 = system.get_function(state, anchor)
        k2 = system.get_function(numpy.add(state, step_size / 2.0 * k1), anchor)
        k3 = system.get_function(numpy.add(state, step_size / 2.0 * k2), anchor)
        k4 = system.get_function(numpy.add(state, step_size * k3), anchor)
        return state + step_size / 6.0 * (k1 + 2 * k2 + 2 * k3 + k4)
