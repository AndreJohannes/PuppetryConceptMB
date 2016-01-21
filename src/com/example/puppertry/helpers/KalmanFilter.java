package com.example.puppertry.helpers;

import java.util.Arrays;

public class KalmanFilter {

	public static class Vector {

		private final int m;
		private double[] data;

		public Vector(int m) {
			this.m = m;
			this.data = new double[m];
		}

		public Vector(double[] in) {
			this.m = in.length;
			this.data = in;
		}

		public void setValue(int idx_m, double value) {
			this.data[idx_m] = value;
		}

		public double getValue(int idx_m) {
			return this.data[idx_m];
		}

		public Vector add(Vector vector) {
			Vector retVector = new Vector(this.m);
			for (int i = 0; i < this.m; i++) {
				retVector.data[i] = this.data[i] + vector.data[i];
			}
			return retVector;
		}

		public Vector sub(Vector vector) {
			Vector retVector = new Vector(this.m);
			for (int i = 0; i < this.m; i++) {
				retVector.data[i] = this.data[i] - vector.data[i];
			}
			return retVector;
		}

		@Override
		public String toString() {
			return Arrays.toString(this.data);
		}

	}

	public static class Matrix {

		private final int n, m;
		private double[][] data;

		public Matrix(int m, int n) {
			this.m = m;
			this.n = n;
			this.data = new double[m][n];
		}

		public void setValue(int idx_m, int idx_n, double value) {
			this.data[idx_m][idx_n] = value;
		}

		public double getValue(int idx_m, int idx_n) {
			return this.data[idx_m][idx_n];
		}

		public Vector multiply(Vector vector) {
			if (vector.m != this.n)
				throw new RuntimeException("Dimensions do not match");
			Vector result = new Vector(this.m);
			for (int i = 0; i < this.m; i++) {
				for (int j = 0; j < this.n; j++) {
					result.data[i] += this.data[i][j] * vector.data[j];
				}
			}
			return result;
		}

		public Matrix multiply(Matrix matrix) {
			if (this.n != matrix.m)
				throw new RuntimeException("Dimensions do not match");
			Matrix result = new Matrix(this.m, matrix.n);
			for (int i = 0; i < this.m; i++) {
				for (int j = 0; j < matrix.n; j++) {
					for (int k = 0; k < this.n; k++)
						result.data[i][j] += this.data[i][k] * matrix.data[k][j];
				}
			}
			return result;
		}

		public Matrix add(Matrix matrix) {
			if (this.m != matrix.m || this.n != matrix.n)
				throw new RuntimeException("Dimensions do not match");
			Matrix result = new Matrix(this.m, this.n);
			for (int i = 0; i < this.m; i++) {
				for (int j = 0; j < this.n; j++) {
					result.data[i][j] = this.data[i][j] + matrix.data[i][j];
				}
			}
			return result;
		}

		public Matrix sub(Matrix matrix) {
			if (this.m != matrix.m || this.n != matrix.n)
				throw new RuntimeException("Dimensions do not match");
			Matrix result = new Matrix(this.m, this.n);
			for (int i = 0; i < this.m; i++) {
				for (int j = 0; j < this.n; j++) {
					result.data[i][j] = this.data[i][j] - matrix.data[i][j];
				}
			}
			return result;
		}

		public Matrix transpose() {
			Matrix retMatrix = new Matrix(this.n, this.m);
			for (int i = 0; i < this.m; i++) {
				for (int j = 0; j < this.n; j++) {
					retMatrix.data[j][i] = this.data[i][j];
				}
			}
			return retMatrix;
		}

		public Matrix inverse() {
			if (this.m != this.n)
				throw new RuntimeException("Matrix is not square");
			switch (this.m) {
			case 2:
				Matrix retMatrix = new Matrix(2, 2);
				double denominator = this.data[0][0] * this.data[1][1] - this.data[0][1] * this.data[1][0];
				retMatrix.data[0][0] = this.data[1][1] / denominator;
				retMatrix.data[1][1] = this.data[0][0] / denominator;
				retMatrix.data[0][1] = -this.data[0][1] / denominator;
				retMatrix.data[1][0] = -this.data[1][0] / denominator;
				return retMatrix;
			case 3:
				retMatrix = new Matrix(3, 3);
				denominator = this.data[0][0] * this.data[1][1] * this.data[2][2]
						+ this.data[1][0] * this.data[2][1] * this.data[0][2]
						+ this.data[2][0] * this.data[0][1] * this.data[1][2]
						- this.data[0][0] * this.data[2][1] * this.data[1][2]
						- this.data[2][0] * this.data[1][1] * this.data[0][2]
						- this.data[1][0] * this.data[0][1] * this.data[2][2];
				retMatrix.data[0][0] = (this.data[1][1] * this.data[2][2] - this.data[1][2] * this.data[2][1])
						/ denominator;
				retMatrix.data[0][1] = (this.data[0][2] * this.data[2][1] - this.data[0][1] * this.data[2][2])
						/ denominator;
				retMatrix.data[0][2] = (this.data[0][1] * this.data[1][2] - this.data[0][2] * this.data[1][1])
						/ denominator;
				retMatrix.data[1][0] = (this.data[1][2] * this.data[2][0] - this.data[1][0] * this.data[2][2])
						/ denominator;
				retMatrix.data[1][1] = (this.data[0][0] * this.data[2][2] - this.data[0][2] * this.data[2][0])
						/ denominator;
				retMatrix.data[1][2] = (this.data[0][2] * this.data[1][0] - this.data[0][0] * this.data[1][2])
						/ denominator;
				retMatrix.data[2][0] = (this.data[1][0] * this.data[2][1] - this.data[1][1] * this.data[2][0])
						/ denominator;
				retMatrix.data[2][1] = (this.data[0][1] * this.data[2][0] - this.data[0][0] * this.data[2][1])
						/ denominator;
				retMatrix.data[2][2] = (this.data[0][0] * this.data[1][1] - this.data[0][1] * this.data[1][0])
						/ denominator;
				return retMatrix;
			}
			throw new RuntimeException("Matrix dimension not supported");
		}

		public Matrix scale(double scale) {
			Matrix retMatrix = new Matrix(this.m, this.n);
			for (int i = 0; i < m; i++) {
				for (int j = 0; j < n; j++) {
					retMatrix.data[i][j] = scale * this.data[i][j];
				}
			}
			return retMatrix;
		}

		public static Matrix eye(int n) {
			Matrix retMatrix = new Matrix(n, n);
			for (int i = 0; i < n; i++) {
				retMatrix.data[i][i] = 1;
			}
			return retMatrix;
		}

	}

	private final Matrix A;
	private final Matrix Q;
	private final Matrix H;
	private Matrix R;
	private Matrix P;
	private Vector x;

	public KalmanFilter(Matrix A, Matrix Q, Matrix H, Matrix R, Vector x, Matrix P) {
		this.A = A;
		this.Q = Q;
		this.H = H;
		this.R = R;
		this.x = x;
		this.P = P;
	}

	public Vector getCurrentState() {
		return x;
	}

	public void setR(Matrix R) {
		this.R = R;
	}

	public Vector step(Vector z) {

		Vector x_predicted = A.multiply(x);
		Matrix P_predicted = A.multiply(P).multiply(A.transpose()).add(Q);

		Vector y = z.sub(H.multiply(x_predicted));

		Matrix S = H.multiply(P_predicted).multiply(H.transpose()).add(R);
		Matrix K = P_predicted.multiply(H.transpose()).multiply(S.inverse());

		x = x_predicted.add(K.multiply(y));
		P = (Matrix.eye(K.m).sub(K.multiply(H))).multiply(P_predicted);
		return x;
	}

}
