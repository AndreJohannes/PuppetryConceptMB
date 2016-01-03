package com.example.puppertry;

import com.example.puppertry.helpers.Commands;

import android.app.Activity;
import android.view.MotionEvent;
import android.view.View;
import android.widget.Button;
import android.widget.CompoundButton;
import android.widget.ToggleButton;

public class ButtonsController {

	private final SensorEvaluator sensorEvaluator;
	private final CommandDispatcher commandDispatcher;
	private final Activity activity;

	public ButtonsController(Activity activity, SensorEvaluator sensorEvaluator, CommandDispatcher commandDispatcher) {

		this.activity = activity;
		this.sensorEvaluator = sensorEvaluator;
		this.commandDispatcher = commandDispatcher;

		final Button calibrationButton = (Button) activity.findViewById(R.id.btnId9);
		calibrationButton.setOnClickListener(getCalibrationListener());

		final Button jawButton = (Button) activity.findViewById(R.id.btnId2);
		jawButton.setOnTouchListener(getJawListener());

		final ToggleButton leftLegTwist = (ToggleButton) activity.findViewById(R.id.btnId4);
		leftLegTwist.setOnCheckedChangeListener(getLeftLegTwisterListener());
	}

	private View.OnClickListener getCalibrationListener() {
		return new View.OnClickListener() {
			public void onClick(View v) {
				sensorEvaluator.setOffset();
			}
		};
	}

	private View.OnTouchListener getJawListener() {
		return new View.OnTouchListener() {

			@Override
			public boolean onTouch(View yourButton, MotionEvent theMotion) {
				switch (theMotion.getAction()) {
				case MotionEvent.ACTION_DOWN:
					commandDispatcher.setCommand(Commands.OpenJaw);
					yourButton.setBackgroundDrawable(activity.getResources().getDrawable(R.drawable.gradient_clicked));
					break;
				case MotionEvent.ACTION_UP:
					commandDispatcher.setCommand(Commands.CloseJaw);
					yourButton.setBackgroundDrawable(activity.getResources().getDrawable(R.drawable.gradient));
					break;
				}
				return true;
			}
		};
	}

	private CompoundButton.OnCheckedChangeListener getLeftLegTwisterListener() {
		return new CompoundButton.OnCheckedChangeListener() {
			public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
				if (isChecked) {
					commandDispatcher.setCommand(Commands.TwistLeftLeg);
					buttonView.setBackgroundDrawable(activity.getResources().getDrawable(R.drawable.gradient_clicked));
				} else {
					commandDispatcher.clearCommand(Commands.TwistLeftLeg);
					buttonView.setBackgroundDrawable(activity.getResources().getDrawable(R.drawable.gradient));
				}
			};
		};
	}

}
