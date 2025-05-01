import { getReviews, deleteReview } from "../../../shared/Api.js";
import { renderDataTable } from "../../js/tableReviews.js"

const container = document.getElementById("page");

async function loadData() {
  const reviews = await getReviews();
  renderDataTable({
    containerId: "page",
    data: reviews,
    viewUrl: "./view-review/index.html",
    onDelete: async (id) => {
      await deleteReview(id);
      loadData();
    },
  });
}
loadData();