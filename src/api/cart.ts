import { getGuestToken } from "@/utility/guestToken";

// Initialize CSRF cookie first
const initCsrf = async () => {
  await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/sanctum/csrf-cookie`, {
    credentials: "include",
  });
};

export const addToCartApi = async (productId: number, quantity: number) => {
  const temp_user_id = getGuestToken();

  // Get CSRF token first
  await initCsrf();

  const response = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/carts/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      id: productId,
      quantity,
      temp_user_id,
    }),
  });

  const data = await response.json();

  if (!data.result) {
    throw new Error(data.message || "Failed to add to cart");
  }
  localStorage.setItem("products", JSON.stringify(data.cart));
  return data;
};

export const deleteCartItemApi = async (cartId: number) => {
  //  Make sure CSRF token is fetched first
  await initCsrf();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_DOMAIN}/carts/${cartId}`,
    {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
    },
  );

  const data = await response.json();

  if (!data.result) {
    throw new Error(data.message || "Delete failed");
  }

  return data;
};
export const changeCartQuantityApi = async (
  cartId: number,
  quantity: number,
) => {
  const temp_user_id = getGuestToken();

  // Get CSRF token first
  await initCsrf();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_DOMAIN}/carts/change-quantity`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        cart_id: cartId,
        quantity,
        temp_user_id,
      }),
    },
  );

  const data = await response.json();

  if (!data.result) {
    throw new Error(data.message || "Failed to update cart quantity");
  }

  return data;
};
