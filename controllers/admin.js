const Product = require('../models/product');

exports.getAdmin = (req, res, next) => {
  res.render('admin/index', {
    pageTitle: 'Admin',
    path: '/admin',
    isAuthenticated: req.isLoggedIn,
    isAdmin: req.isAdmin,
  });
};

exports.getEditProducts = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      res.render('admin/edit-products', {
        pageTitle: 'Edit Products',
        path: '/admin/edit-products',
        products: products,
        isAuthenticated: req.isLoggedIn,
        isAdmin: req.isAdmin,
      });
    })
    .catch((err) => console.log(err));
};

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    isAuthenticated: req.isLoggedIn,
    isAdmin: req.isAdmin,
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const price = req.body.price;
  const description = req.body.description;
  const image = req.body.image;
  const product = new Product(
    title,
    price,
    description,
    image,
    null,
    req.user._id
  );
  product
    .save()
    .then((result) => {
      console.log('Created product');
      res.redirect('/');
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findById(prodId).then((product) => {
    if (!product) {
      return res.redirect('/');
    }
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product: product,
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedDescription = req.body.description;
  const updatedImage = req.body.image;
  const product = new Product(
    updatedTitle,
    updatedPrice,
    updatedDescription,
    updatedImage,
    prodId
  );
  product
    .save()
    .then((result) => {
      console.log('Updated Product!');
      res.redirect('/admin/edit-products');
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.deleteById(prodId)
    .then(() => {
      console.log('Destroyed product');
      res.redirect('/admin/edit-products');
    })
    .catch((err) => console.log(err));
};
