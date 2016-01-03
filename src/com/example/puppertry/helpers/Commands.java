package com.example.puppertry.helpers;

public enum Commands {
	OpenJaw(1, true), CloseJaw(2, true),
	TwistLeftLeg(3, true);
	
	private final int value;
	private final boolean oneHitOnly;
	
	Commands(int value, boolean oneHitOnly) {
		this.value = value;
		this.oneHitOnly = oneHitOnly;
	}

	public int getInt() {
		return value;
	}
	
	public boolean isOneHitOnly(){
		return oneHitOnly;
	}
}
