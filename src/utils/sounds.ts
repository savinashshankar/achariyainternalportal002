// Sound effects utility using Web Audio API
// No external files needed - generates sounds programmatically

class SoundEffects {
    private audioContext: AudioContext | null = null;
    private _muted: boolean = false;

    get muted(): boolean {
        return this._muted;
    }

    toggleMute(): boolean {
        this._muted = !this._muted;
        return this._muted;
    }

    setMuted(muted: boolean): void {
        this._muted = muted;
    }

    private getContext(): AudioContext {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        return this.audioContext;
    }

    // Play a tone with given frequency and duration
    private playTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.3) {
        if (this._muted) return;
        try {
            const ctx = this.getContext();
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            oscillator.type = type;
            oscillator.frequency.value = frequency;
            gainNode.gain.value = volume;

            // Fade out
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

            oscillator.start(ctx.currentTime);
            oscillator.stop(ctx.currentTime + duration);
        } catch (e) {
            console.log('Sound not available');
        }
    }

    // Dice roll - multiple quick clicks
    rollDice() {
        for (let i = 0; i < 5; i++) {
            setTimeout(() => this.playTone(200 + Math.random() * 100, 0.05, 'square', 0.1), i * 50);
        }
    }

    // Spinner spin - whoosh effect
    spinWheel() {
        for (let i = 0; i < 8; i++) {
            setTimeout(() => this.playTone(300 + i * 50, 0.1, 'sine', 0.15), i * 60);
        }
    }

    // Coin flip - metallic ping
    flipCoin() {
        this.playTone(800, 0.15, 'triangle', 0.2);
        setTimeout(() => this.playTone(600, 0.1, 'triangle', 0.15), 100);
    }

    // Coin land
    coinLand() {
        this.playTone(400, 0.2, 'sine', 0.2);
    }

    // Click sound for buttons/guesses
    click() {
        this.playTone(500, 0.05, 'square', 0.1);
    }

    // Success sound - ascending notes
    success() {
        this.playTone(523, 0.15, 'sine', 0.25); // C5
        setTimeout(() => this.playTone(659, 0.15, 'sine', 0.25), 100); // E5
        setTimeout(() => this.playTone(784, 0.2, 'sine', 0.3), 200); // G5
    }

    // Wrong/error sound
    wrong() {
        this.playTone(200, 0.2, 'sawtooth', 0.15);
        setTimeout(() => this.playTone(150, 0.3, 'sawtooth', 0.1), 150);
    }

    // Binary search guess - beep
    guess() {
        this.playTone(600, 0.1, 'sine', 0.2);
    }

    // Higher hint
    higher() {
        this.playTone(400, 0.1, 'sine', 0.15);
        setTimeout(() => this.playTone(500, 0.1, 'sine', 0.15), 80);
    }

    // Lower hint
    lower() {
        this.playTone(500, 0.1, 'sine', 0.15);
        setTimeout(() => this.playTone(400, 0.1, 'sine', 0.15), 80);
    }

    // Milestone achieved - fanfare
    milestone() {
        const notes = [523, 659, 784, 1047]; // C, E, G, C octave
        notes.forEach((freq, i) => {
            setTimeout(() => this.playTone(freq, 0.2, 'sine', 0.25), i * 100);
        });
    }

    // Sorting comparison
    compare() {
        this.playTone(300 + Math.random() * 200, 0.03, 'sine', 0.08);
    }

    // Swap sound
    swap() {
        this.playTone(400, 0.05, 'square', 0.1);
        setTimeout(() => this.playTone(500, 0.05, 'square', 0.1), 30);
    }
}

// Export singleton instance
export const sounds = new SoundEffects();
