#!/usr/bin/env python3
"""
Audio analysis for Life Force track - beat detection, frequency spectrum, waveform analysis
"""
import librosa
import numpy as np
import json
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

# Load audio
import os
script_dir = os.path.dirname(os.path.abspath(__file__))
mp3_path = os.path.join(script_dir, 'life_force.mp3')
y, sr = librosa.load(mp3_path, sr=None)
duration = len(y) / sr
print(f"Duration: {duration:.2f}s")
print(f"Sample rate: {sr}Hz")
print(f"Samples: {len(y)}")

# 1. Beat detection
tempo, beat_frames = librosa.beat.beat_track(y=y, sr=sr, units='frames')
beat_times = librosa.frames_to_time(beat_frames, sr=sr)
print(f"Estimated tempo: {float(tempo.item()):.1f} BPM")
print(f"Number of beats: {len(beat_times)}")
print(f"Beat times: {beat_times[:20]}")

# 2. Onset detection (more precise for cuts)
onset_frames = librosa.onset.onset_detect(y=y, sr=sr, units='frames', backtrack=True)
onset_times = librosa.frames_to_time(onset_frames, sr=sr)
print(f"Number of onsets: {len(onset_times)}")
print(f"Onset times: {onset_times[:30]}")

# 3. Spectral analysis
# Spectral centroid (brightness)
spectral_centroids = librosa.feature.spectral_centroid(y=y, sr=sr)[0]
spectral_centroid_times = librosa.frames_to_time(np.arange(len(spectral_centroids)), sr=sr)

# Spectral rolloff
spectral_rolloff = librosa.feature.spectral_rolloff(y=y, sr=sr)[0]

# Spectral bandwidth
spectral_bandwidth = librosa.feature.spectral_bandwidth(y=y, sr=sr)[0]

# MFCCs
mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)

# Chroma (harmonic content)
chroma = librosa.feature.chroma_stft(y=y, sr=sr)

# 4. RMS energy (for dynamic cuts)
rms = librosa.feature.rms(y=y, frame_length=2048, hop_length=512)[0]
rms_times = librosa.frames_to_time(np.arange(len(rms)), sr=sr)

# 5. Harmonic/Percussive separation
y_harmonic, y_percussive = librosa.effects.hpss(y)

# 6. Find strong beats for sync points
# Use onset strength envelope
onset_env = librosa.onset.onset_strength(y=y, sr=sr)
onset_env_times = librosa.frames_to_time(np.arange(len(onset_env)), sr=sr)

# Peak pick onset envelope for strong sync points
from scipy.signal import find_peaks
peaks, properties = find_peaks(onset_env, height=np.percentile(onset_env, 85), distance=sr//512*2)
peak_times = librosa.frames_to_time(peaks, sr=sr)
print(f"Strong sync points (peaks): {len(peak_times)}")
print(f"Peak times: {peak_times[:30]}")

# 7. Frequency bands analysis
# Split into sub-bands
n_fft = 2048
stft = np.abs(librosa.stft(y, n_fft=n_fft))
freqs = librosa.fft_frequencies(sr=sr, n_fft=n_fft)

# Define frequency bands
bands = {
    'sub_bass': (20, 60),
    'bass': (60, 250),
    'low_mid': (250, 500),
    'mid': (500, 2000),
    'high_mid': (2000, 4000),
    'presence': (4000, 6000),
    'brilliance': (6000, 20000)
}
band_energy = {}
for band_name, (low, high) in bands.items():
    mask = (freqs >= low) & (freqs <= high)
    band_energy[band_name] = np.mean(stft[mask, :], axis=0)

# 8. Save analysis results
analysis = {
    'duration': float(duration),
    'sample_rate': int(sr),
    'tempo': float(tempo.item()),
    'beat_times': beat_times.tolist(),
    'onset_times': onset_times.tolist(),
    'peak_times': peak_times.tolist(),
    'spectral_centroid': spectral_centroids.tolist(),
    'spectral_centroid_times': spectral_centroid_times.tolist(),
    'spectral_rolloff': spectral_rolloff.tolist(),
    'spectral_bandwidth': spectral_bandwidth.tolist(),
    'rms': rms.tolist(),
    'rms_times': rms_times.tolist(),
    'onset_env': onset_env.tolist(),
    'onset_env_times': onset_env_times.tolist(),
    'band_energy': {k: v.tolist() for k, v in band_energy.items()},
    'mfccs': mfccs.tolist(),
    'chroma': chroma.tolist()
}

with open('audio_analysis.json', 'w') as f:
    json.dump(analysis, f, indent=2)

print("Audio analysis saved to audio_analysis.json")

# 9. Generate visualizations
fig, axes = plt.subplots(5, 1, figsize=(15, 20))

# Waveform
axes[0].plot(np.linspace(0, duration, len(y)), y, alpha=0.5, linewidth=0.3)
axes[0].set_title('Waveform')
axes[0].set_ylabel('Amplitude')

# RMS energy
axes[1].plot(rms_times, rms, color='orange', linewidth=0.8)
axes[1].set_title('RMS Energy')
axes[1].set_ylabel('Energy')

# Onset strength with peaks
axes[2].plot(onset_env_times, onset_env, color='green', linewidth=0.8)
axes[2].scatter(peak_times, onset_env[peaks], color='red', s=10, zorder=5)
axes[2].set_title('Onset Strength (red = strong sync points)')
axes[2].set_ylabel('Strength')

# Spectral centroid
axes[3].plot(spectral_centroid_times, spectral_centroids, color='purple', linewidth=0.8)
axes[3].set_title('Spectral Centroid (Brightness)')
axes[3].set_ylabel('Hz')

# Frequency band energy over time
for i, (band_name, energy) in enumerate(band_energy.items()):
    axes[4].plot(onset_env_times[:len(energy)], energy, label=band_name, alpha=0.7, linewidth=0.5)
axes[4].set_title('Frequency Band Energy')
axes[4].set_ylabel('Energy')
axes[4].legend(loc='upper right', fontsize=8)
axes[4].set_xlabel('Time (s)')

plt.tight_layout()
plt.savefig('audio_analysis.png', dpi=150)
plt.close()

print("Visualizations saved to audio_analysis.png")

# 10. Create beat-sync timeline for video editing
# Group beats into measures (assuming 4/4 time)
beats_per_measure = 4
measures = []
for i in range(0, len(beat_times), beats_per_measure):
    measure_beats = beat_times[i:i+beats_per_measure]
    if len(measure_beats) == beats_per_measure:
        measures.append({
            'measure': len(measures) + 1,
            'start': float(measure_beats[0]),
            'end': float(measure_beats[-1]),
            'beats': measure_beats.tolist()
        })

with open('beat_timeline.json', 'w') as f:
    json.dump({
        'tempo': float(tempo.item()),
        'beats_per_measure': beats_per_measure,
        'measures': measures,
        'total_measures': len(measures),
        'strong_sync_points': peak_times.tolist()
    }, f, indent=2)

print(f"Beat timeline saved: {len(measures)} measures")
print("Done!")