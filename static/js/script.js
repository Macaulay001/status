document.addEventListener("DOMContentLoaded", () => {
    const currentStatus = document.getElementById("current-status");
    const statusOptions = document.getElementById("status-options");
    const newStatusInput = document.getElementById("new-status");
    const updateButton = document.getElementById("update-button");
    const addButton = document.getElementById("add-button");
    const deleteButton = document.getElementById("delete-button");

    // Fetch and display the current status and options
    const fetchStatuses = async () => {
        const response = await fetch("/get_status");
        const data = await response.json();
        currentStatus.textContent = data.current;
        statusOptions.innerHTML = data.options
            .map(option => `<option value="${option}">${option}</option>`)
            .join("");
    };

    // Update the current status
    updateButton.addEventListener("click", async () => {
        const selectedStatus = statusOptions.value;
        await fetch("/update_status", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: selectedStatus }),
        });
        await fetchStatuses();
    });

    // Add a new status
    addButton.addEventListener("click", async () => {
        const newStatus = newStatusInput.value.trim();
        if (newStatus) {
            await fetch("/add_status", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });
            newStatusInput.value = "";
            await fetchStatuses();
        }
    });

    // Delete the selected status
    deleteButton.addEventListener("click", async () => {
        const selectedStatus = statusOptions.value;
        await fetch("/delete_status", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: selectedStatus }),
        });
        await fetchStatuses();
    });

    // Periodically refresh the status every 3 minutes
    setInterval(fetchStatuses, 3000);

    // Initial fetch
    fetchStatuses();
});
