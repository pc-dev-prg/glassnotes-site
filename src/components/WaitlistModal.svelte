<script>
  import { onMount } from "svelte";
  import { fade, fly } from "svelte/transition";

  export let isOpen = false;
  export let waitlistId = "5aa1d8de-5ea0-4d89-a5e9-315b0b695590";

  let name = "";
  let email = "";
  let status = "idle"; // idle, loading, success, error
  let errorMessage = "";

  const closeModal = () => {
    if (status === "loading") return;
    isOpen = false;
    // Reset form after closing if successful
    if (status === "success") {
      setTimeout(() => {
        status = "idle";
        name = "";
        email = "";
      }, 300);
    }
  };

  async function handleSubmit() {
    if (!email) return;

    status = "loading";
    errorMessage = "";

    try {
      const response = await fetch(
        "https://glassnotes-headquarters.vercel.app/api/waitlist",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            name,
            waitlist_id: waitlistId,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        status = "success";
      } else {
        status = "error";
        errorMessage = data.error || "Something went wrong. Please try again.";
      }
    } catch (e) {
      status = "error";
      errorMessage = "Failed to connect to the server.";
    }
  }

  onMount(() => {
    const handleOpen = () => {
      isOpen = true;
    };
    window.addEventListener("open-waitlist-modal", handleOpen);
    return () => window.removeEventListener("open-waitlist-modal", handleOpen);
  });

  // Handle ESC key to close
  function handleKeydown(event) {
    if (event.key === "Escape" && isOpen) {
      closeModal();
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if isOpen}
  <div
    class="modal-backdrop"
    on:click|self={closeModal}
    on:keydown={(e) => e.key === "Escape" && closeModal()}
    role="button"
    tabindex="-1"
    transition:fade={{ duration: 300 }}
  >
    <div
      class="modal-content glass"
      role="dialog"
      aria-modal="true"
      transition:fly={{ y: 20, duration: 400 }}
    >
      <button class="close-btn" on:click={closeModal} aria-label="Close">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          ><line x1="18" y1="6" x2="6" y2="18"></line><line
            x1="6"
            y1="6"
            x2="18"
            y2="18"
          ></line></svg
        >
      </button>

      {#if status === "success"}
        <div class="success-state" in:fade>
          <div class="icon-circle">✨</div>
          <h2>You're on the list!</h2>
          <p>
            Thank you for your interest in GlassNotes. We'll notify you as soon
            as we're ready for more users.
          </p>
          <button class="cta-button primary" on:click={closeModal}
            >Awesome</button
          >
        </div>
      {:else}
        <div class="form-state">
          <div class="header">
            <span class="badge"
              ><span class="badge-dot"></span> Early Access</span
            >
            <h2>Join the Waitlist</h2>
            <p>
              Be the first to experience the future of note-taking across all
              your devices.
            </p>
          </div>

          <form on:submit|preventDefault={handleSubmit}>
            <div class="input-group">
              <label for="name">Full Name</label>
              <input
                id="name"
                type="text"
                placeholder="John Doe"
                class="glass-input"
                bind:value={name}
                disabled={status === "loading"}
              />
            </div>

            <div class="input-group">
              <label for="email">Email Address</label>
              <input
                id="email"
                type="email"
                placeholder="john@example.com"
                class="glass-input"
                required
                bind:value={email}
                disabled={status === "loading"}
              />
            </div>

            {#if status === "error"}
              <p class="error-msg" in:fade>{errorMessage}</p>
            {/if}

            <button
              type="submit"
              class="cta-button primary submit-btn"
              disabled={status === "loading"}
            >
              {#if status === "loading"}
                <span class="loader"></span> Joining...
              {:else}
                Join the Waitlist
              {/if}
            </button>
          </form>

          <p class="form-footer">
            No spam. Only major updates and early access invites.
          </p>
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
    padding: 20px;
  }

  .modal-content {
    width: 100%;
    max-width: 500px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 24px;
    padding: 40px;
    position: relative;
    box-shadow:
      0 30px 60px rgba(0, 0, 0, 0.4),
      inset 0 0 20px rgba(255, 255, 255, 0.02);
  }

  .close-btn {
    position: absolute;
    top: 20px;
    right: 20px;
    background: none;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    padding: 8px;
    border-radius: 50%;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .close-btn:hover {
    background: rgba(255, 255, 255, 0.05);
    color: #fff;
  }

  .header {
    text-align: center;
    margin-bottom: 32px;
  }

  .header h2 {
    font-size: 2.2rem;
    letter-spacing: -1px;
    margin: 12px 0;
  }

  .header p {
    color: var(--text-muted);
    font-size: 1.1rem;
    line-height: 1.5;
  }

  .input-group {
    margin-bottom: 20px;
  }

  .input-group label {
    display: block;
    font-size: 0.9rem;
    font-weight: 600;
    margin-bottom: 8px;
    color: var(--text-muted);
    margin-left: 4px;
  }

  .glass-input {
    width: 100%;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 14px 18px;
    color: #fff;
    font-size: 1rem;
    transition: all 0.3s ease;
  }

  .glass-input:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.08);
    border-color: var(--primary);
    box-shadow: 0 0 0 4px rgba(92, 124, 255, 0.15);
  }

  .submit-btn {
    width: 100%;
    justify-content: center;
    margin-top: 12px;
    padding: 16px;
    font-size: 1.1rem;
  }

  .error-msg {
    color: #ff5f56;
    background: rgba(255, 95, 86, 0.1);
    padding: 12px;
    border-radius: 10px;
    font-size: 0.9rem;
    margin-bottom: 20px;
    text-align: center;
    border: 1px solid rgba(255, 95, 86, 0.2);
  }

  .success-state {
    text-align: center;
    padding: 20px 0;
  }

  .icon-circle {
    width: 64px;
    height: 64px;
    background: rgba(92, 124, 255, 0.2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.8rem;
    margin: 0 auto 24px;
    border: 2px solid rgba(92, 124, 255, 0.3);
  }

  .success-state h2 {
    font-size: 2rem;
    margin-bottom: 16px;
  }

  .success-state p {
    color: var(--text-muted);
    line-height: 1.6;
    margin-bottom: 32px;
  }

  .form-footer {
    text-align: center;
    font-size: 0.8rem;
    color: var(--text-muted);
    margin-top: 24px;
  }

  /* Loader */
  .loader {
    width: 18px;
    height: 18px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: #fff;
    animation: spin 0.8s linear infinite;
    display: inline-block;
    margin-right: 10px;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  @media (max-width: 480px) {
    .modal-content {
      padding: 30px 20px;
    }
    .header h2 {
      font-size: 1.8rem;
    }
  }
</style>
