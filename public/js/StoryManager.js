class StoryManager {
  constructor() {
    this.steps = [
      {
        title: "The Journey of Souls",
        text: "In a vast connected world, two souls wander, destined to meet. This isn't just a game of maps—it's a journey of connection.",
      },
      {
        title: "The Beacon",
        text: "One soul takes the role of the <strong>The Beacon</strong> (Setter). You choose a secret place in the world that means something to you, planting a flag for your partner to find.",
      },
      {
        title: "The Seeker",
        text: "The other becomes <strong>The Seeker</strong> (Guesser). Guided only by intuition and the hints whispered by the Beacon, you search the globe to find where your other half is waiting.",
      },
      {
        title: "The Reunion",
        text: "As you guess closer, the bond strengthens. Your goal is not just to score points, but to achieve <strong>Resonance</strong>—finding the exact spot where your paths cross.",
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
    this.nextBtn.textContent = this.currentStep === this.steps.length - 1 ? 'Finish' : 'Next';
  }
}
