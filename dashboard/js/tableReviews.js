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

  const container = document.getElementById(containerId);
  const paginationContainer = document.createElement("ul");
  paginationContainer.className = "pagination justify-content-center mt-3";

  function renderTable() {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginated = filteredData.slice(start, end);

    let tableHTML = `

      <div class="table-responsive">
      <table style="width:100%" class="table table-bordered table-hover text-center align-middle">
        <thead class="table-dark">
          <tr>
            <th style="cursor:pointer" data-col="id">ID</th>
            <th style="cursor:pointer" data-col="name">Stars </th>
            <th style="cursor:pointer" data-col="name">Comment </th>
            <th style="cursor:pointer" data-col="createdAt">Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
    `;

    paginated.forEach((item) => {
      tableHTML += `
        <tr>
          <td>${item.id}</td>
          <td>${item.stars}</td>
          <td>${item.comment.slice(0, 100)}</td>
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
      container.innerHTML = `<div class="container mt-3">No Products Found</div>`;
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
      btn.onclick = () => onDelete?.(id);
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
