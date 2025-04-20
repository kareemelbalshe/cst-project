export function renderDataTable({
  containerId,
  data,
  onDelete,
  viewUrl = null,
  editUrl = null,
  itemsPerPage = 5,
}) {
  let currentPage = 1;
  let currentSortColumn = null;
  let currentSortDirection = "asc";
  let filteredData = [...data];

  const container = document.getElementById(containerId);
  const paginationContainer = document.createElement("ul");
  paginationContainer.className = "pagination justify-content-center mt-3";

  function renderTable() {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginated = filteredData.slice(start, end);

    let tableHTML = `
      <input type="text" placeholder="Search..." id="${containerId}-search" class="form-control mb-3 w-50 mx-auto"/>

      <div class="table-responsive">
      <table class="table table-bordered table-hover text-center align-middle">
        <thead class="table-dark">
          <tr>
            <th style="cursor:pointer" data-col="id">ID</th>
            <th style="cursor:pointer" data-col="name">Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
    `;

    paginated.forEach((item) => {
      tableHTML += `
        <tr>
          <td>${item.id}</td>
          <td>${item.name}</td>
          <td>
            ${
              viewUrl
                ? `<a href="${viewUrl}?id=${item.id}" class="btn btn-sm btn-info me-1">View</a>`
                : ""
            }
            ${
              editUrl
                ? `<a href="${editUrl}?id=${item.id}" class="btn btn-sm btn-warning me-1">Edit</a>`
                : ""
            }
            <button class="btn btn-sm btn-danger" data-action="delete" data-id="${
              item.id
            }">Delete</button>
          </td>
        </tr>
      `;
    });

    tableHTML += `</tbody></table></div>`;
    container.innerHTML = tableHTML;
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
      btn.onclick = () => onDelete?.(id);
    });

    const search = document.getElementById(`${containerId}-search`);
    search.addEventListener("input", (e) => {
      const term = e.target.value.toLowerCase();
      filteredData = data.filter((item) =>
        item.name.toLowerCase().includes(term)
      );
      currentPage = 1;
      renderTable();
    });

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
          if (a[col] < b[col]) return currentSortDirection === "asc" ? -1 : 1;
          if (a[col] > b[col]) return currentSortDirection === "asc" ? 1 : -1;
          return 0;
        });

        renderTable();
      };
    });
  }

  renderTable();
}
