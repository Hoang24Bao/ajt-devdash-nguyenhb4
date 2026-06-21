//Hàm sanitizeQuery: Chuẩn hóa chuỗi truy vấn bằng cách chuyển đổi thành chữ thường và loại bỏ khoảng trắng thừa
export function sanitizeQuery(text: string): string {
  return text.toLowerCase().trim();
}