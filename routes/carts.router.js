// src/routes/carts.router.js
import { Router } from "express";
import CartModel from "../models/Cart.js";

const router = Router();

// GET con populate
router.get("/:cid", async (req, res) => {
  const cart = await CartModel.findById(req.params.cid).populate(
    "products.product",
  );

  res.json(cart);
});

// DELETE producto
router.delete("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;

  const cart = await CartModel.findById(cid);
  cart.products = cart.products.filter((p) => p.product.toString() !== pid);

  await cart.save();
  res.send("Producto eliminado");
});

// PUT carrito completo
router.put("/:cid", async (req, res) => {
  const cart = await CartModel.findByIdAndUpdate(
    req.params.cid,
    { products: req.body },
    { new: true },
  );

  res.json(cart);
});

// PUT cantidad
router.put("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  const cart = await CartModel.findById(cid);

  const product = cart.products.find((p) => p.product.toString() === pid);
  if (product) product.quantity = quantity;

  await cart.save();
  res.json(cart);
});

// DELETE vaciar carrito
router.delete("/:cid", async (req, res) => {
  await CartModel.findByIdAndUpdate(req.params.cid, { products: [] });
  res.send("Carrito vacío");
});

export default router;
