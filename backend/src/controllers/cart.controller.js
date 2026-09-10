const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const cartService = require("../services/cart.service");
const { cartOwnerFromReq } = require("../middlewares/guestCart.middleware");

const getCart = asyncHandler(async (req, res) => {
  const cart = await cartService.getOrCreateCart(cartOwnerFromReq(req));
  res.json(new ApiResponse("Cart fetched", { cart }));
});

const addItem = asyncHandler(async (req, res) => {
  const cart = await cartService.addItem(cartOwnerFromReq(req), req.body);
  res.status(201).json(new ApiResponse("Item added to cart", { cart }));
});

const updateItem = asyncHandler(async (req, res) => {
  const cart = await cartService.updateItemQuantity(
    cartOwnerFromReq(req),
    req.params.itemId,
    req.body.quantity
  );
  res.json(new ApiResponse("Cart item updated", { cart }));
});

const removeItem = asyncHandler(async (req, res) => {
  const cart = await cartService.removeItem(cartOwnerFromReq(req), req.params.itemId);
  res.json(new ApiResponse("Cart item removed", { cart }));
});

const clearCart = asyncHandler(async (req, res) => {
  const cart = await cartService.clearCart(cartOwnerFromReq(req));
  res.json(new ApiResponse("Cart cleared", { cart }));
});

module.exports = { getCart, addItem, updateItem, removeItem, clearCart };
