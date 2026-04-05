// src/routes/products.router.js
import { Router } from "express";
import ProductModel from "../models/Product.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    let filter = {};

    if (query) {
      filter = {
        $or: [{ category: query }, { status: query === "true" }],
      };
    }

    let options = {
      page: parseInt(page),
      limit: parseInt(limit),
      lean: true,
    };

    if (sort) {
      options.sort = { price: sort === "asc" ? 1 : -1 };
    }

    const result = await ProductModel.paginate(filter, options);

    res.json({
      status: "success",
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? `?page=${result.prevPage}` : null,
      nextLink: result.hasNextPage ? `?page=${result.nextPage}` : null,
    });
  } catch (error) {
    res.status(500).json({ status: "error", error });
  }
});

export default router;
