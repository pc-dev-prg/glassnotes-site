<script>
  let email = '';
  let submitted = false;

  async function handleSubmit() {
    if (!email) return;
    // Potenciální integrace s Vercel API
    console.log('Submitting email:', email);
    submitted = true;
    email = '';
    
    // Reset after 3 seconds
    setTimeout(() => {
      submitted = false;
    }, 5000);
  }
</script>

<div class="waitlist-form">
  {#if !submitted}
    <input 
      type="email" 
      placeholder="Enter your email to join the waitlist" 
      class="glass-input"
      bind:value={email}
    >
    <button class="cta-button secondary" on:click={handleSubmit}>Notify Me</button>
  {:else}
    <div class="success-message" style="color: #c084fc; font-weight: 600; padding: 18px;">
      ✨ You're on the list! We'll be in touch soon.
    </div>
  {/if}
</div>

<style>
  .success-message {
    animation: fadeIn 0.5s ease-out;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
</style>
