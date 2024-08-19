import Swal from "sweetalert2";

type ErrorData = {
  text?: string;
  title?: string;
}

export const handleApiDefaultError = (error: any) => {
  Swal.fire({
    icon: "error",
    title: "Oops...",
    text: error.response.data?.text || "",
    footer: "<i>" + error.message + "</i>",
    timer: 1500,
  });
}

export const handleApiError = (data: ErrorData) => {
  Swal.fire({
    icon: "error",
    title: data.title || "Oh non !",
    text: data.text || "",
    timer: 1500,
  });
}
