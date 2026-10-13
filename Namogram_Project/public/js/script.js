document.addEventListener("DOMContentLoaded", () => {
    // =========================================================================
    // 1. LIKE / UNLIKE HANDLER VIA AJAX (INSTAGRAM STYLE)
    // =========================================================================
    document.querySelectorAll(".like-btn").forEach((btn) => {
        btn.addEventListener("click", async (e) => {
            e.preventDefault();
            const postId = btn.getAttribute("data-post-id");
            if (!postId) return;

            try {
                const response = await fetch(`/posts/${postId}/like`, {
                    method: "POST",
                    headers: {
                        "X-Requested-With": "XMLHttpRequest",
                        "Accept": "application/json",
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.success) {
                        const icon = btn.querySelector("i");
                        if (data.liked) {
                            btn.classList.add("liked");
                            if (icon) {
                                icon.className = "fa-solid fa-heart";
                            }
                        } else {
                            btn.classList.remove("liked");
                            if (icon) {
                                icon.className = "fa-regular fa-heart";
                            }
                        }

                        // Update like count text
                        const countEl = document.getElementById(`like-count-${postId}`);
                        if (countEl) {
                            countEl.textContent = data.likeCount;
                        }

                        // Update likes modal list
                        const modalList = document.getElementById(`likesList-${postId}`);
                        if (modalList) {
                            if (!data.likes || data.likes.length === 0) {
                                modalList.innerHTML = `<div class="text-muted text-center py-4">No likes yet. Be the first to like this!</div>`;
                            } else {
                                modalList.innerHTML = data.likes.map(user => `
                                    <div class="likes-user-row">
                                        <div class="likes-user-left">
                                            <div class="likes-user-avatar">
                                                ${user.charAt(0).toUpperCase()}
                                            </div>
                                            <a href="/profile/${user}" class="likes-user-name">${user}</a>
                                        </div>
                                        <a href="/profile/${user}" class="btn btn-outline-custom btn-sm">View Profile</a>
                                    </div>
                                `).join("");
                            }
                        }
                    }
                }
            } catch (err) {
                console.error("Failed to toggle like:", err);
            }
        });
    });

    // =========================================================================
    // 2. TAG SELECTOR LOGIC (MIN 1, MAX 3 TAGS)
    // =========================================================================
    const tagCheckboxes = document.querySelectorAll(".tag-chip-checkbox");
    const tagCountEl = document.getElementById("tagCount");
    const tagErrorEl = document.getElementById("tagError");
    const postForm = document.getElementById("postForm");

    function updateTagsState() {
        const checked = document.querySelectorAll(".tag-chip-checkbox:checked");
        const count = checked.length;

        if (tagCountEl) {
            tagCountEl.textContent = count;
        }

        tagCheckboxes.forEach((cb) => {
            const label = cb.closest(".tag-chip-label");
            if (count >= 3 && !cb.checked) {
                cb.disabled = true;
                if (label) label.classList.add("disabled");
            } else {
                cb.disabled = false;
                if (label) label.classList.remove("disabled");
            }
        });

        if (tagErrorEl && count >= 1 && count <= 3) {
            tagErrorEl.style.display = "none";
        }
    }

    if (tagCheckboxes.length > 0) {
        tagCheckboxes.forEach((cb) => {
            cb.addEventListener("change", updateTagsState);
        });
        updateTagsState(); // Initialize state
    }

    if (postForm) {
        postForm.addEventListener("submit", (e) => {
            const checked = document.querySelectorAll(".tag-chip-checkbox:checked");
            if (checked.length < 1 || checked.length > 3) {
                e.preventDefault();
                if (tagErrorEl) {
                    tagErrorEl.style.display = "block";
                    tagErrorEl.scrollIntoView({ behavior: "smooth", block: "center" });
                }
            }
        });
    }

    // =========================================================================
    // 3. IMAGE URL LIVE PREVIEW
    // =========================================================================
    const imageInput = document.getElementById("postImageUrl");
    const previewImg = document.getElementById("previewImage");
    const previewPlaceholder = document.getElementById("previewPlaceholder");

    if (imageInput && previewImg && previewPlaceholder) {
        const updateImagePreview = () => {
            const url = imageInput.value.trim();
            if (url) {
                previewImg.src = url;
                previewImg.style.display = "block";
                previewPlaceholder.style.display = "none";
            } else {
                previewImg.style.display = "none";
                previewPlaceholder.style.display = "block";
            }
        };

        previewImg.onerror = () => {
            previewImg.style.display = "none";
            previewPlaceholder.style.display = "block";
            previewPlaceholder.innerHTML = `<span class="text-danger"><i class="fa-solid fa-triangle-exclamation mb-1"></i><br>Image failed to load. Check URL.</span>`;
        };

        previewImg.onload = () => {
            previewImg.style.display = "block";
            previewPlaceholder.style.display = "none";
        };

        imageInput.addEventListener("input", updateImagePreview);
        imageInput.addEventListener("change", updateImagePreview);

        if (imageInput.value.trim()) {
            updateImagePreview();
        }
    }

    // =========================================================================
    // 4. SIGNUP USERNAME VALIDATION (AJAX CHECK)
    // =========================================================================
    const usernameInput = document.getElementById("usernameInput");
    const validateBtn = document.getElementById("validateUsernameBtn");
    const usernameStatus = document.getElementById("usernameStatus");
    const validateBtnText = document.getElementById("validateBtnText");

    async function checkUsernameAvailability() {
        if (!usernameInput || !usernameStatus) return;
        const username = usernameInput.value.trim();

        if (!username) {
            usernameStatus.style.display = "block";
            usernameStatus.innerHTML = `<span class="text-warning"><i class="fa-solid fa-triangle-exclamation me-1"></i> Please enter a username first.</span>`;
            return;
        }

        if (!/^[a-zA-Z0-9_]{3,30}$/.test(username)) {
            usernameStatus.style.display = "block";
            usernameStatus.innerHTML = `<span class="text-danger"><i class="fa-solid fa-circle-xmark me-1"></i> 3-30 letters, numbers, or underscores only.</span>`;
            return;
        }

        if (validateBtnText) validateBtnText.textContent = "Checking...";
        if (validateBtn) validateBtn.disabled = true;

        try {
            const res = await fetch(`/api/check-username?username=${encodeURIComponent(username)}`);
            const data = await res.json();

            usernameStatus.style.display = "block";
            if (data.available) {
                usernameStatus.innerHTML = `<span class="text-success"><i class="fa-solid fa-circle-check me-1"></i> ${data.message}</span>`;
            } else {
                usernameStatus.innerHTML = `<span class="text-danger"><i class="fa-solid fa-circle-xmark me-1"></i> ${data.message}</span>`;
            }
        } catch (err) {
            console.error("Failed to check username:", err);
            usernameStatus.style.display = "block";
            usernameStatus.innerHTML = `<span class="text-danger">Unable to verify right now.</span>`;
        } finally {
            if (validateBtnText) validateBtnText.textContent = "Validate";
            if (validateBtn) validateBtn.disabled = false;
        }
    }

    if (validateBtn) {
        validateBtn.addEventListener("click", checkUsernameAvailability);
    }
    if (usernameInput) {
        usernameInput.addEventListener("blur", () => {
            if (usernameInput.value.trim()) {
                checkUsernameAvailability();
            }
        });
    }

    // =========================================================================
    // 5. FOLLOW / UNFOLLOW HANDLER VIA AJAX
    // =========================================================================
    const followBtn = document.getElementById("followBtn");
    if (followBtn) {
        followBtn.addEventListener("click", async (e) => {
            e.preventDefault();
            const username = followBtn.getAttribute("data-username");
            if (!username) return;

            try {
                followBtn.disabled = true;
                const response = await fetch(`/profile/${username}/follow`, {
                    method: "POST",
                    headers: {
                        "X-Requested-With": "XMLHttpRequest",
                        "Accept": "application/json",
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.success) {
                        if (data.isFollowing) {
                            followBtn.classList.add("following");
                            followBtn.textContent = "Following";
                        } else {
                            followBtn.classList.remove("following");
                            followBtn.textContent = "Follow";
                        }

                        const followersVal = document.getElementById("followersCountVal");
                        if (followersVal) {
                            followersVal.textContent = data.followersCount;
                        }
                    }
                }
            } catch (err) {
                console.error("Follow request failed:", err);
            } finally {
                followBtn.disabled = false;
            }
        });
    }

    // =========================================================================
    // 6. ACCOUNT TYPE SWITCHER (PRIVATE VS CREATOR)
    // =========================================================================
    const btnSwitchPrivate = document.getElementById("btnSwitchPrivate");
    const btnSwitchCreator = document.getElementById("btnSwitchCreator");

    async function switchAccountType(targetType) {
        try {
            const response = await fetch("/profile/account-type", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                    "Accept": "application/json",
                },
                body: JSON.stringify({ accountType: targetType }),
            });

            if (response.ok) {
                // Reload profile page to update creator analytics button & badges
                window.location.reload();
            }
        } catch (err) {
            console.error("Failed to switch account type:", err);
        }
    }

    const btnQuickToggleAccount = document.getElementById("btnQuickToggleAccount");
    if (btnQuickToggleAccount) {
        btnQuickToggleAccount.addEventListener("click", () => {
            const targetType = btnQuickToggleAccount.getAttribute("data-target-type");
            if (targetType) switchAccountType(targetType);
        });
    }

    if (btnSwitchPrivate) {
        btnSwitchPrivate.addEventListener("click", () => switchAccountType("private"));
    }
    if (btnSwitchCreator) {
        btnSwitchCreator.addEventListener("click", () => switchAccountType("creator"));
    }
});
