export function renderDataTable({
  containerId,
  data,
  onDelete,
  viewUrl = null,
  itemsPerPage = 7,
}) {
  let currentPage = 1;
  let currentSortColumn = null;
  let currentSortDirection = "asc";
  let filteredData = [...data];
  const selectedItems = [];

  const container = document.getElementById(containerId);
  const paginationContainer = document.createElement("ul");
  paginationContainer.className = "pagination justify-content-center mt-3";

  function renderTable() {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginated = filteredData.slice(start, end);

    let tableHTML = `
    <div class="d-flex flex-wrap align-items-start justify-content-between mb-3 gap-2">
        <input type="text" placeholder="Search..." id="${containerId}-search" class="form-control w-75"/>
        <div>
          <button id="${containerId}-search-btn" class="btn btn-dark">
          <i class="bi bi-search"></i>
          Search</button>
          <button id="${containerId}-delete-btn" class="btn btn-danger">
          <i class="bi bi-trash"></i>
          Delete</button>
        </div>
      </div>

      <div class="table-responsive">
        <table style="width:100%" class="table table-bordered table-hover text-center align-middle">
          <thead class="table-dark">
            <tr>
            <th style="cursor:pointer;z-index:1" data-col="id">
            <input style="cursor:pointer;z-index:10" type="checkbox" id="selectAll" />
            ID
            </th>
              <th style="cursor:pointer" data-col="product">Product</th>
              <th style="cursor:pointer" data-col="customer">Customer</th>
              <th style="cursor:pointer" data-col="total">Total</th>
              <th style="cursor:pointer" data-col="createdAt">Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
    `;

    paginated.forEach((item) => {
      const product = item.product || "N/A";
      const customer = item.customer || "N/A";

      tableHTML += `
        <tr id="tr-${item.id}">
          <td>
          <input type="checkbox" class="form-check-input" id="${containerId}-${
        item.id
      }" />
          ${item.id}
          </td>
          <td>${product.slice(0, 40)}</td>
          <td>${customer?customer:"Deleted Account"}</td>
          <td>${parseFloat(item.total)}</td>
          <td>${new Date(item.createdAt).toLocaleString()}</td>
          <td class="d-flex flex-wrap align-items-center justify-content-center gap-2">
            ${
              viewUrl
                ? `<a href="${viewUrl}?id=${item.id}" class="btn btn-sm btn-info me-1"><i class="bi bi-eye"></i> View</a>`
                : ""
            }
            <button class="btn btn-sm btn-danger" data-action="delete" data-id="${
              item.id
            }"><i class="bi bi-trash"></i> Delete</button>
          </td>
        </tr>
      `;
    });

    tableHTML += `</tbody></table></div>`;

    if (paginated.length === 0) {
      container.innerHTML = `<div class="container mt-3">No carts found.</div>`;
    } else {
      container.innerHTML = tableHTML;
    }

    container.appendChild(paginationContainer);
    renderPagination();
    attachEvents();
  }

  function renderPagination() {
    paginationContainer.innerHTML = "";
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    for (let i = 1; i <= totalPages; i++) {
      const li = document.createElement("li");
      li.className = "page-item" + (i === currentPage ? " active" : "");
      li.innerHTML = `<a href="#" class="page-link">${i}</a>`;
      li.addEventListener("click", (e) => {
        e.preventDefault();
        currentPage = i;
        renderTable();
      });
      paginationContainer.appendChild(li);
    }
  }

  function attachEvents() {
    container.querySelectorAll("[data-action='delete']").forEach((btn) => {
      const id = btn.getAttribute("data-id");
      btn.onclick = () => {
        Swal.fire({
          title: "Are you sure?",
          text: "This item will be deleted permanently.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "Yes, delete it!",
        }).then((result) => {
          if (result.isConfirmed) {
            onDelete?.(id);
            Swal.fire("Deleted!", "The item has been deleted.", "success");
          }
        });
      };
    });

    const search = document.getElementById(`${containerId}-search`);
    const searchBtn = document.getElementById(`${containerId}-search-btn`);
    searchBtn.onclick = () => {
      const term = search.value.toLowerCase();
      filteredData = data.filter((item) =>
        item.name.toLowerCase().includes(term)
      );
      currentPage = 1;
      renderTable();
    };

    container.querySelectorAll("th[data-col]").forEach((th) => {
      th.onclick = () => {
        const col = th.getAttribute("data-col");
        if (currentSortColumn === col) {
          currentSortDirection =
            currentSortDirection === "asc" ? "desc" : "asc";
        } else {
          currentSortColumn = col;
          currentSortDirection = "asc";
        }

        filteredData.sort((a, b) => {
          let valA = a[col];
          let valB = b[col];

          if (col === "total" || col === "id") {
            valA = parseFloat(valA);
            valB = parseFloat(valB);
          } else {
            if (typeof valA === "string") valA = valA.toLowerCase();
            if (typeof valB === "string") valB = valB.toLowerCase();
          }

          if (valA < valB) return currentSortDirection === "asc" ? -1 : 1;
          if (valA > valB) return currentSortDirection === "asc" ? 1 : -1;
          return 0;
        });

        renderTable();
      };
    });

    const selectAll = document.getElementById("selectAll");
    selectAll.addEventListener("click", (e) => {
      e.stopPropagation();
      const checkboxes = container.querySelectorAll(
        `input[type="checkbox"]:not(#selectAll)`
      );
      checkboxes.forEach((checkbox) => {
        const id = checkbox.id.replace(`${containerId}-`, "");
        checkbox.checked = e.target.checked;

        const row = document.getElementById(`tr-${id}`);
        if (e.target.checked) {
          selectedItems.push(id);
          row.classList.add("table-active", "border", "border-dark");
        } else {
          selectedItems.pop(id);
          row.classList.remove("table-active", "border", "border-dark");
        }
      });
    });

    container
      .querySelectorAll(`input[type="checkbox"]:not(#selectAll)`)
      .forEach((checkbox) => {
        checkbox.addEventListener("change", (e) => {
          const id = e.target.id.replace(`${containerId}-`, "");
          const row = document.getElementById(`tr-${id}`);

          if (e.target.checked) {
            selectedItems.push(id);
            row.classList.add("table-active", "border", "border-dark");
          } else {
            selectedItems.splice(selectedItems.indexOf(id), 1);
            row.classList.remove("table-active", "border", "border-dark");
          }

          const allCheckboxes = container.querySelectorAll(
            `input[type="checkbox"]:not(#selectAll)`
          );
          const allChecked = [...allCheckboxes].every((cb) => cb.checked);
          selectAll.checked = allChecked;
        });
      });

    const deleteBtn = document.getElementById(`${containerId}-delete-btn`);
    deleteBtn.addEventListener("click", () => {
      if (selectedItems.length === 0) {
        Swal.fire({
          icon: "warning",
          title: "No items selected",
          text: "Please select at least one item to delete.",
        });
        return;
      }

      Swal.fire({
        title: "Are you sure?",
        text: "This item will be deleted permanently.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          selectedItems.forEach(async (id) => {
            await onDelete?.(id);
          });
          Swal.fire("Deleted!", "The items have been deleted.", "success");
          selectedItems.length = 0;
          renderTable();
        }
      });
    });
  }

  renderTable();
}
