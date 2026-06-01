/* 
========================================================================
   KAIRMA INTERACTIVE ENGINE (v1.0)
   Interactivity logic for navbar, scroll behaviors, and responsive overlay
========================================================================
*/

document.addEventListener('DOMContentLoaded', () => {
    
    // Core Elements
    const header = document.getElementById('header');
    const hamburger = document.getElementById('hamburger');
    const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    
    // 1. Navbar Scroll Shrink & Blur Effect
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Run immediately in case of page reload with scroll offset
    
    // 2. Hamburger Menu Toggle
    const toggleMobileMenu = () => {
        const isActive = hamburger.classList.toggle('active');
        mobileNavOverlay.classList.toggle('active');
        
        // Prevent body scrolling when mobile overlay is active
        if (isActive) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    };
    
    hamburger.addEventListener('click', toggleMobileMenu);
    
    // 3. Close Mobile Menu when links are clicked
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileNavOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // 4. Scroll-Triggered Stat Number Counting Animation
    const statsNumbers = document.querySelectorAll('.stat-number');
    
    const animateNumbers = () => {
        statsNumbers.forEach(num => {
            const target = parseFloat(num.getAttribute('data-target'));
            const prefix = num.getAttribute('data-prefix') || '';
            const suffix = num.getAttribute('data-suffix') || '';
            const decimals = parseInt(num.getAttribute('data-decimals') || '0');
            
            let start = 0;
            const duration = 1800; // 1.8 seconds counting duration
            const startTime = performance.now();
            
            const updateNumber = (currentTime) => {
                const elapsedTime = currentTime - startTime;
                if (elapsedTime >= duration) {
                    num.textContent = prefix + target.toFixed(decimals) + suffix;
                } else {
                    const progress = elapsedTime / duration;
                    // Smooth cubic ease-out curve
                    const easeProgress = 1 - Math.pow(1 - progress, 3);
                    const currentVal = start + easeProgress * (target - start);
                    num.textContent = prefix + currentVal.toFixed(decimals) + suffix;
                    requestAnimationFrame(updateNumber);
                }
            };
            
            requestAnimationFrame(updateNumber);
        });
    };
    
    const statsObserverOptions = {
        root: null,
        threshold: 0.15 // Trigger when 15% of the stats section is visible
    };
    
    const statsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateNumbers();
                observer.unobserve(entry.target); // Trigger count up animation only once
            }
        });
    }, statsObserverOptions);
    
    const inflectionSection = document.querySelector('.inflection');
    if (inflectionSection) {
        statsObserver.observe(inflectionSection);
    }

    // 5. Sequential Looping Accordion Visualizer
    const accordion = document.getElementById('entropy-accordion');
    const leakItems = document.querySelectorAll('.leak-item');
    const leakBars = document.querySelectorAll('.leak-bar');
    
    if (accordion && leakItems.length > 0) {
        let currentIndex = 0;
        let lastTime = null;
        let elapsed = 0;
        const duration = 5000; // 5 seconds per item
        let animationFrameId = null;
        let isSectionVisible = false;
        
        // Helper to update active element states
        const setActiveItem = (index) => {
            currentIndex = index;
            leakItems.forEach((item, idx) => {
                if (idx === index) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
        };
        
        // Helper to clear and reset progress bar widths
        const resetProgressBars = () => {
            leakBars.forEach(bar => {
                bar.style.width = '0%';
            });
        };
        
        // The main clock tick driven by high-performance requestAnimationFrame
        const tick = (timestamp) => {
            if (!lastTime) {
                lastTime = timestamp;
            }
            
            const delta = timestamp - lastTime;
            lastTime = timestamp;
            
            // Only advance progress if the section is actively visible in viewport and tab is focused
            if (isSectionVisible && !document.hidden) {
                elapsed += delta;
                
                if (elapsed >= duration) {
                    // Loop limit exceeded: reset and advance to next sequence index
                    elapsed = 0;
                    resetProgressBars();
                    
                    const nextIndex = (currentIndex + 1) % leakItems.length;
                    setActiveItem(nextIndex);
                } else {
                    // Drive active progress bar width frame-by-frame
                    const activeBar = leakItems[currentIndex].querySelector('.leak-bar');
                    if (activeBar) {
                        const percentage = (elapsed / duration) * 100;
                        activeBar.style.width = `${percentage}%`;
                    }
                }
            }
            
            animationFrameId = requestAnimationFrame(tick);
        };
        
        // Interactive Manual Click Overrides
        leakItems.forEach((item, index) => {
            const header = item.querySelector('.leak-header');
            if (header) {
                header.addEventListener('click', () => {
                    // Reset all bar states
                    resetProgressBars();
                    
                    // Activate selected item
                    setActiveItem(index);
                    
                    // Flush timer states to start a clean 5-second cycle
                    elapsed = 0;
                    lastTime = performance.now();
                });
            }
        });
        
        // Intersection Observer to only run loops when visible
        const entropyObserverOptions = {
            root: null,
            threshold: 0.15 // Start ticking when 15% visible
        };
        
        const entropyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    isSectionVisible = true;
                    entry.target.classList.add('active'); // General layout entrance triggers
                    
                    if (!animationFrameId) {
                        lastTime = performance.now();
                        animationFrameId = requestAnimationFrame(tick);
                    }
                } else {
                    isSectionVisible = false;
                }
            });
        }, entropyObserverOptions);
        
        const entropySection = document.querySelector('.entropy-section');
        if (entropySection) {
            entropyObserver.observe(entropySection);
        }
        
        // Document Focus / Visibility Change events to prevent out-of-sync jumps
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                lastTime = null; // Mark invalid delta frame on resume
            } else {
                lastTime = performance.now();
            }
        });
        
        // Initialize Accordion state on load
        resetProgressBars();
        setActiveItem(0);
    }

    // 6. Scroll-Triggered Scroll Reveal Transition (Section 4 unrolling)
    const trigger = document.querySelector('.scroll-reveal-trigger');
    const reliquarySection = document.querySelector('.reliquary-section');
    const scrollRoller = document.querySelector('.scroll-roller');
    
    if (trigger && reliquarySection && scrollRoller) {
        const handleScrollReveal = () => {
            // Bypass logic altogether on mobile devices since layout is relative and scroll roller is hidden
            if (window.innerWidth <= 768) {
                reliquarySection.style.clipPath = '';
                reliquarySection.style.visibility = 'visible';
                return;
            }
            
            const triggerRect = trigger.getBoundingClientRect();
            const triggerTop = triggerRect.top + window.scrollY;
            const triggerHeight = triggerRect.height;
            const viewportHeight = window.innerHeight;
            
            const startScroll = triggerTop;
            const endScroll = triggerTop + triggerHeight - viewportHeight;
            const currentScroll = window.scrollY;
            
            let progress = 0;
            if (currentScroll > startScroll) {
                progress = (currentScroll - startScroll) / (endScroll - startScroll);
            }
            
            // Clamp progress between 0 and 1
            progress = Math.max(0, Math.min(1, progress));
            
            // Apply clip-path to unroll the Sutra Paper Ash ground
            const unrollPercent = 100 - (progress * 100);
            reliquarySection.style.clipPath = `inset(0px 0px ${unrollPercent}% 0px)`;
            
            // Position the roller bar precisely at the bottom edge of the revealed section
            scrollRoller.style.top = `${progress * 100}%`;
            
            // Fade out the scroll roller rod after unrolling is completed, and hide when fully closed
            if (progress >= 0.98) {
                scrollRoller.style.opacity = '0';
                scrollRoller.style.pointerEvents = 'none';
            } else if (progress <= 0.02) {
                scrollRoller.style.opacity = '0';
                scrollRoller.style.pointerEvents = 'none';
            } else {
                scrollRoller.style.opacity = '1';
                scrollRoller.style.pointerEvents = 'auto';
            }
            
            // Optimize visibility: when scroll is fully closed, hide content to prevent layout overlaps
            if (progress === 0) {
                reliquarySection.style.visibility = 'hidden';
            } else {
                reliquarySection.style.visibility = 'visible';
            }
        };
        
        window.addEventListener('scroll', handleScrollReveal);
        window.addEventListener('resize', handleScrollReveal);
        handleScrollReveal(); // Run on load
    }

    // 7. Section 5: Interactive Terminal Logging HUD & Web Audio Muyu Synthesizer
    const terminalTrigger = document.getElementById('terminal-trigger');
    const terminalConsole = document.getElementById('terminal-console');
    
    if (terminalTrigger && terminalConsole) {
        
        // In-Browser Synthesizer: Wooden Muyu Click + High-Frequency Paper Rustle
        const playMuyuSound = () => {
            try {
                const AudioContextClass = window.AudioContext || window.webkitAudioContext;
                if (!AudioContextClass) return;
                const ctx = new AudioContextClass();
                const now = ctx.currentTime;
                
                // 1. Synthesize Muyu Wooden Fish Block Strike
                const osc = ctx.createOscillator();
                const gainOsc = ctx.createGain();
                
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(540, now);
                osc.frequency.exponentialRampToValueAtTime(140, now + 0.05); // Rapid pitch sweep down
                
                gainOsc.gain.setValueAtTime(0.75, now);
                gainOsc.gain.exponentialRampToValueAtTime(0.001, now + 0.06); // Extremely sharp decay for dry woody sound
                
                osc.connect(gainOsc);
                gainOsc.connect(ctx.destination);
                
                // 2. Synthesize Paper Rustle Stamp Snap (Filtered white noise)
                const bufferSize = ctx.sampleRate * 0.05; // 50 milliseconds
                const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
                const data = buffer.getChannelData(0);
                for (let i = 0; i < bufferSize; i++) {
                    data[i] = Math.random() * 2 - 1;
                }
                
                const noiseNode = ctx.createBufferSource();
                noiseNode.buffer = buffer;
                
                const filter = ctx.createBiquadFilter();
                filter.type = 'bandpass';
                filter.frequency.value = 1600;
                filter.Q.value = 3.5;
                
                const gainNoise = ctx.createGain();
                gainNoise.gain.setValueAtTime(0.25, now);
                gainNoise.gain.exponentialRampToValueAtTime(0.001, now + 0.045);
                
                noiseNode.connect(filter);
                filter.connect(gainNoise);
                gainNoise.connect(ctx.destination);
                
                // Trigger oscillators & noise sources
                osc.start(now);
                osc.stop(now + 0.07);
                
                noiseNode.start(now);
                noiseNode.stop(now + 0.05);
                
            } catch (err) {
                console.warn('Web Audio compilation blocked or not supported on this platform:', err);
            }
        };
        
        // Terminal Logging Operation Pipeline Stream
        terminalTrigger.addEventListener('click', () => {
            if (terminalTrigger.classList.contains('executing')) return;
            
            // Lock trigger controls
            terminalTrigger.classList.add('executing');
            terminalTrigger.textContent = 'Synking...';
            
            // Play synthesized wood block sound immediately in response to user tap
            playMuyuSound();
            
            // Flush current terminal screen content
            terminalConsole.innerHTML = '';
            
            const logs = [
                { text: '[OK] Preprocessing local brand data lake...', type: 'ok', delay: 0 },
                { text: '[OK] Stripping identifying personal tokens...', type: 'ok', delay: 400 },
                { text: '[OK] Routing sovereign localized task structure to Multi-Model Router...', type: 'ok', delay: 800 },
                { text: '[OK] Dynamic gateway matched secure DeepSeek-V3 path.', type: 'ok', delay: 1200 },
                { text: '[METRICS] Outbound bandwidth minimized by 50%', type: 'metrics', delay: 1600 },
                { text: '[STATUS] RECURSIVE SUPERPOSITION UNBROKEN', type: 'status', delay: 2000 }
            ];
            
            logs.forEach(log => {
                setTimeout(() => {
                    const span = document.createElement('span');
                    span.className = `console-line ${log.type}`;
                    span.textContent = log.text;
                    terminalConsole.appendChild(span);
                    
                    // Auto scroll terminal output screen
                    terminalConsole.scrollTop = terminalConsole.scrollHeight;
                }, log.delay);
            });
            
            // Release execution lock
            setTimeout(() => {
                terminalTrigger.classList.remove('executing');
                terminalTrigger.textContent = 'Execute Synk';
            }, 2400);
            
        });
    }

    // 8. Section 6: Mobile Touch Accordion Interactions (The Fates grid expansion)
    const fatesSlots = document.querySelectorAll('.fates-slot');
    
    if (fatesSlots.length > 0) {
        fatesSlots.forEach(slot => {
            slot.addEventListener('click', () => {
                // Apply accordion expansion behavior only on mobile/tablet viewports
                if (window.innerWidth <= 768) {
                    const isAlreadyActive = slot.classList.contains('active');
                    
                    // Collapse all other slots
                    fatesSlots.forEach(s => s.classList.remove('active'));
                    
                    // Toggle the clicked slot
                    if (!isAlreadyActive) {
                        slot.classList.add('active');
                    }
                }
            });
        });
    }

    // 9. Symmetrical Scroll-Triggered Footer Scroll-Up Reveal
    const footerTrigger = document.querySelector('.footer-reveal-trigger');
    const footer = document.getElementById('footer');
    const footerRoller = document.querySelector('.footer-roller');
    
    if (footerTrigger && footer && footerRoller) {
        const handleFooterReveal = () => {
            // Bypass scroll unroll on mobile/tablet viewports
            if (window.innerWidth <= 768) {
                footer.style.clipPath = '';
                footer.style.visibility = 'visible';
                footerRoller.style.opacity = '0';
                return;
            }
            
            const triggerRect = footerTrigger.getBoundingClientRect();
            const triggerTop = triggerRect.top + window.scrollY;
            const triggerHeight = triggerRect.height;
            const viewportHeight = window.innerHeight;
            
            const startScroll = triggerTop - viewportHeight;
            const endScroll = triggerTop;
            const currentScroll = window.scrollY;
            
            let progress = 0;
            if (currentScroll > startScroll) {
                progress = (currentScroll - startScroll) / (endScroll - startScroll);
            }
            
            // Clamp progress between 0 and 1
            progress = Math.max(0, Math.min(1, progress));
            
            // For scroll-up unrolling, at progress 0, it is 100% rolled down (hidden).
            // At progress 1, it is 0% rolled down (fully revealed).
            // Clip-path inset goes from inset(100% 0px 0px 0px) to inset(0% 0px 0px 0px) to reveal from bottom up.
            let unrollPercent = 100 - (progress * 100);
            if (progress >= 0.98) {
                unrollPercent = 0;
            }
            footer.style.clipPath = `inset(${unrollPercent}% 0px 0px 0px)`;
            
            // The roller rod slides UPWARDS from top: 100% to top: 0%.
            footerRoller.style.top = `${unrollPercent}%`;
            
            // Fade out the scroll roller rod after unrolling is completed, and hide when fully closed
            if (progress >= 0.98) {
                footerRoller.style.opacity = '0';
                footerRoller.style.pointerEvents = 'none';
            } else if (progress <= 0.02) {
                footerRoller.style.opacity = '0';
                footerRoller.style.pointerEvents = 'none';
            } else {
                footerRoller.style.opacity = '1';
                footerRoller.style.pointerEvents = 'auto';
            }
            
            // Optimize visibility
            if (progress === 0) {
                footer.style.visibility = 'hidden';
            } else {
                footer.style.visibility = 'visible';
            }
        };
        
        window.addEventListener('scroll', handleFooterReveal);
        window.addEventListener('resize', handleFooterReveal);
        handleFooterReveal(); // Run immediately on load
    }

});
