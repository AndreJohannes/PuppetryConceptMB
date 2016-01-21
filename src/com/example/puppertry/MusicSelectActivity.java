package com.example.puppertry;

import java.io.IOException;
import java.util.LinkedList;
import java.util.List;
import android.app.ListActivity;
import android.content.res.AssetFileDescriptor;
import android.media.MediaMetadataRetriever;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.ListView;

public class MusicSelectActivity extends ListActivity {

	private class MusicItem {

		private final String name;
		private final AssetFileDescriptor fd;

		public MusicItem(String name, AssetFileDescriptor fd) {
			this.name = name;
			this.fd = fd;
		}

		@Override
		public String toString() {
			return this.name;
		}

	}

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		List<MusicItem> values = new LinkedList<MusicItem>();
		MediaMetadataRetriever metaRetriver = new MediaMetadataRetriever();

		try {
			for (String name : this.getAssets().list("music")) {
				AssetFileDescriptor fd = this.getAssets().openFd("music/" + name);
				metaRetriver.setDataSource(fd.getFileDescriptor(), fd.getStartOffset(), fd.getLength());
				String title = metaRetriver.extractMetadata(MediaMetadataRetriever.METADATA_KEY_TITLE);
				String artist = metaRetriver.extractMetadata(MediaMetadataRetriever.METADATA_KEY_ARTIST);
				values.add(new MusicItem(artist + " - " + title, fd));
			}
		} catch (IOException e) {
			Log.e("tag", "Failed to get asset file list.", e);
		}

		ArrayAdapter<MusicItem> adapter = new ArrayAdapter<MusicItem>(this, android.R.layout.simple_list_item_1,
				values);
		setListAdapter(adapter);
	}

	@Override
	protected void onListItemClick(ListView list, View view, int position, long id) {
		super.onListItemClick(list, view, position, id);
		MusicItem selectedItem = (MusicItem) getListView().getItemAtPosition(position);
		HTTPServer.getInstance(this).setMusicFile(selectedItem.fd);
		finish();
		//text.setText("You clicked " + selectedItem + " at position " + position);
	}

}