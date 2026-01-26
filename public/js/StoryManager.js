class StoryManager {
  constructor() {
    this.steps = [
      {
        title: "Act I: The Drift",
        text: "In the chaos of the digital ether, we are often lost signals. Drifting energetic points looking for a frequency that matches our own. This world is vast, but connection is inevitable.",
      },
      {
        title: "Act II: The Anchor",
        text: "One soul becomes the <strong>Anchor</strong> (Setter). You must find a place of stillness in this noisy world. Plant your feet, cast your signal, and wait for the echo that says you are not alone.",
      },
      {
        title: "Act III: The Resonance",
        text: "The other becomes the <strong>Seeker</strong> (Guesser). You do not search with eyes, but with intuition. Feel the pull of the bond. The closer you get to the Anchor, the stronger the vibration in your heart.",
      },
      {
        title: "Act IV: The Convergence",
        text: "<strong>Resonance</strong> is achieved when two points occupy the same emotional space. Close the distance. Find the spot where your timelines intersect. <em>Eureka.</em>",
      }
    ];
    this.currentStep = 0;
    
    // UI Elements
    this.overlay = document.getElementById('story-overlay');
    this.titleEl = document.getElementById('story-title');
    this.textEl = document.getElementById('story-text');
    this.prevBtn = document.getElementById('story-prev-btn');
    this.nextBtn = document.getElementById('story-next-btn');
    this.closeBtn = document.getElementById('story-close-btn');
    this.guideBtn = document.getElementById('guide-btn');
    
    this.addEventListeners();
  }

  addEventListeners() {
    this.guideBtn.addEventListener('click', () => this.open());
    this.closeBtn.addEventListener('click', () => this.close());
    this.prevBtn.addEventListener('click', () => this.prev());
    this.nextBtn.addEventListener('click', () => this.next());
    
    // Close on background click
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) this.close();
    });
  }

  open() {
    this.currentStep = 0;
    this.render();
    this.overlay.classList.remove('hidden');
  }

  close() {
    this.overlay.classList.add('hidden');
  }

  next() {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
      this.render();
    } else {
      this.close();
    }
  }

  prev() {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.render();
    }
  }

  render() {
    const step = this.steps[this.currentStep];
    this.titleEl.innerHTML = step.title;
    this.textEl.innerHTML = step.text;
    
    // Button States
    this.prevBtn.style.visibility = this.currentStep === 0 ? 'hidden' : 'visible';
    this.nextBtn.textContent = this.currentStep === this.steps.length - 1 ? 'Begin' : 'Next';
    
    // Add VIVELE accent to current step (optional enhancement hook)
    this.titleEl.style.opacity = '0';
    this.textEl.style.opacity = '0';
    
    // Simple fade in effect for text transition
    setTimeout(() => {
        this.titleEl.style.transition = 'opacity 0.4s ease';
        this.textEl.style.transition = 'opacity 0.4s ease';
        this.titleEl.style.opacity = '1';
        this.textEl.style.opacity = '1';
    }, 50);
  }
}
