package com.example.puppertry;

import com.example.puppertry.helpers.Commands;

import android.app.Activity;
import android.view.MotionEvent;
import android.view.View;
import android.widget.Button;
import android.widget.CompoundButton;
import android.widget.SeekBar;
import android.widget.SeekBar.OnSeekBarChangeListener;
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

		final ToggleButton musicToggler = (ToggleButton) activity.findViewById(R.id.btnId8);
		musicToggler.setOnCheckedChangeListener(getAudioListener());

		final ToggleButton rollEyes = (ToggleButton) activity.findViewById(R.id.btnId1);
		rollEyes.setOnCheckedChangeListener(getEyeListener());

		final SeekBar hightSlider = (SeekBar) activity.findViewById(R.id.seekBar1);
		hightSlider.setOnSeekBarChangeListener(getHightSliderListener());

	}

	private View.OnClickListener getCalibrationListener() {
		return new View.OnClickListener() {
			public void onClick(View v) {
				sensorEvaluator.setCalibrationOffset();
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

	private CompoundButton.OnCheckedChangeListener getAudioListener() {
		return new CompoundButton.OnCheckedChangeListener() {
			public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
				if (isChecked) {
					commandDispatcher.setCommand(Commands.PlayAudio);
					buttonView.setBackgroundDrawable(activity.getResources().getDrawable(R.drawable.gradient_clicked));
				} else {
					commandDispatcher.setCommand(Commands.StopAudio);
					buttonView.setBackgroundDrawable(activity.getResources().getDrawable(R.drawable.gradient));
				}
			};
		};
	}

	private CompoundButton.OnCheckedChangeListener getEyeListener() {
		return new CompoundButton.OnCheckedChangeListener() {
			public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
				if (isChecked) {
					commandDispatcher.setCommand(Commands.RollEyes);
					buttonView.setBackgroundDrawable(activity.getResources().getDrawable(R.drawable.gradient_clicked));
				} else {
					commandDispatcher.setCommand(Commands.StopEyes);
					buttonView.setBackgroundDrawable(activity.getResources().getDrawable(R.drawable.gradient));
				}
			};
		};
	}

	private OnSeekBarChangeListener getHightSliderListener() {
		return new OnSeekBarChangeListener() {
			@Override
			public void onStopTrackingTouch(SeekBar seekBar) {
			}

			@Override
			public void onStartTrackingTouch(SeekBar seekBar) {
			}

			@Override
			public void onProgressChanged(SeekBar seekBar, int progress, boolean fromUser) {
				sensorEvaluator.setAccelerationOffset(
						20.0 * (double) (seekBar.getMax() - progress) / (double) seekBar.getMax());
			}
		};
	}

}
