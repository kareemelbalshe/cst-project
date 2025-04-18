export function renderDataTable({
    containerId,
    data,
    onView,
    onEdit,
    onDelete,
    itemsPerPage = 5
  }) {
    let currentPage = 1;
    let currentSortColumn = null;
    let currentSortDirection = 'asc';
    let filteredData = [...data];
  
    const container = document.getElementById(containerId);
    const paginationContainer = document.createElement("ul");
    paginationContainer.className = "pagination mt-3";
  
    function renderTable() {
      const start = (currentPage - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      const paginated = filteredData.slice(start, end);
  
      let tableHTML = `
        <input type="text" placeholder="Search..." id="${containerId}-search" class="form-control mb-3"/>
        <table class="table table-bordered table-hover">
          <thead class="table-dark">
            <tr>
              <th style="cursor:pointer" data-col="id">ID</th>
              <th style="cursor:pointer" data-col="name">Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
      `;
  
      paginated.forEach(item => {
        tableHTML += `
          <tr>
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>
              <button class="btn btn-sm btn-info" data-action="view" data-id="${item.id}">View</button>
              <button class="btn btn-sm btn-warning" data-action="edit" data-id="${item.id}">Edit</button>
              <button class="btn btn-sm btn-danger" data-action="delete" data-id="${item.id}">Delete</button>
            </td>
          </tr>
        `;
      });
  
      tableHTML += `</tbody></table>`;
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
        li.addEventListener("click", e => {
          e.preventDefault();
          currentPage = i;
          renderTable();
        });
        paginationContainer.appendChild(li);
      }
    }
  
    function attachEvents() {
      container.querySelectorAll("[data-action]").forEach(btn => {
        const action = btn.getAttribute("data-action");
        const id = btn.getAttribute("data-id");
        if (action === "view") btn.onclick = () => onView?.(id);
        if (action === "edit") btn.onclick = () => onEdit?.(id);
        if (action === "delete") btn.onclick = () => onDelete?.(id);
      });
  
      const search = document.getElementById(`${containerId}-search`);
      search.addEventListener("input", e => {
        const term = e.target.value.toLowerCase();
        filteredData = data.filter(item => item.name.toLowerCase().includes(term));
        currentPage = 1;
        renderTable();
      });
  
      container.querySelectorAll("th[data-col]").forEach(th => {
        th.onclick = () => {
          const col = th.getAttribute("data-col");
          if (currentSortColumn === col) {
            currentSortDirection = currentSortDirection === "asc" ? "desc" : "asc";
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
  