<script setup lang="ts">
// Full-screen loading overlay with pulsating anchor logo
</script>

<template>
    <div class="loading-overlay">
        <div class="logo-wrapper">
            <svg class="anchor-logo" width="81" height="116" viewBox="0 0 81 116" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M40.0859 0C50.8212 4.19266e-05 59.5234 8.96151 59.5234 20.0156C59.5232 31.0695 50.821 40.0302 40.0859 40.0303C29.3508 40.0303 20.6477 31.0696 20.6475 20.0156C20.6475 8.96148 29.3507 0 40.0859 0ZM40.0859 10.0186C34.7183 10.0186 30.3672 14.4993 30.3672 20.0264C30.3673 25.5533 34.7184 30.0342 40.0859 30.0342C45.4535 30.0341 49.8046 25.5533 49.8047 20.0264C49.8047 14.4993 45.4535 10.0186 40.0859 10.0186Z" fill="currentColor"/>
                <path d="M40.1221 19.2528C44.8602 19.2529 46.045 22.6377 46.045 24.33V31.2831L56.4512 31.2831L56.7989 31.2919C60.3755 31.473 63.2198 34.431 63.2198 38.0526C63.2197 41.6742 60.3755 44.6312 56.7989 44.8124L56.4512 44.8212H46.045L46.045 93.3846C54.64 93.2299 60.0973 87.4823 61.7667 84.5887L63.254 84.9198L57.5362 82.3583C62.731 79.8198 72.7043 71.9736 71.042 60.8973C76.2367 63.4357 84.8251 73.0815 77.6221 91.3573L73.4756 89.4999C70.3536 95.1363 61.9298 104.016 46.045 106.531V106.588L46.1133 106.588L46.045 106.684L46.045 106.826L45.7159 107.154L40.1905 115.049L34.9825 107.609L34.1993 106.826V106.509C18.4025 103.964 10.0172 95.1201 6.90435 89.4999L2.75885 91.3573C-4.44413 73.0815 4.14428 63.4357 9.33892 60.8973C7.67665 71.9736 17.65 79.8198 22.8448 82.3583L17.126 84.9198L18.6143 84.5887C20.2748 87.467 25.6831 93.1689 34.1993 93.3817V44.8212L25.1446 44.8212L24.796 44.8124C21.2196 44.631 18.3761 41.674 18.376 38.0526C18.376 34.3142 21.4062 31.2831 25.1446 31.2831H34.1993L34.1993 24.33C34.1993 22.6377 35.3839 19.2528 40.1221 19.2528Z" fill="currentColor"/>
            </svg>
        </div>
    </div>
</template>

<style scoped>

.loading-overlay {
    position: fixed;
    inset: 0;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: var(--sidebar-width);
    margin-top: var(--topbar-height);
    background: rgba(var(--bg-color-rgb), 0.7);
}

.logo-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
}

.anchor-logo {
    color: var(--accent-color);
    width: 72px;
    height: auto;
    animation: anchor-pulse 1.8s ease-in-out infinite;
}

@keyframes anchor-pulse {
    0%, 100% {
        opacity: 1;
        transform: scale(1.2);
    }
    50% {
        opacity: 0.45;
        transform: scale(1);
    }
}
</style>