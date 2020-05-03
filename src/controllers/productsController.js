const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	// Root - Show all products
	root: function(req, res, next) {
        let productos = products;

        res.render("products", {
            title: "Lista de Productos",
            productos: productos,
            toThousand: toThousand
        });
    },

	// Detail - Detail from one product
	detail: function(req, res, next) {
        let producto = products.find(function(element) {
            return element.id == req.params.id
        });
        
        let title = producto.name;
        res.render("detail", {
            title: title,
            producto: producto,
            toThousand: toThousand

        });
        
    },

	// Create - Form to create
	
	create: function(req, res, next) {
        res.render("product-create-form");
    },
	
	// Create -  Method to store
	store: (req, res) => {
		//console.log(req.body)
		//res.send(req.body)
		let ultimoProducto=products[products.length-1]
		let nuevoProducto= {};
		nuevoProducto.id=ultimoProducto.id+1
		nuevoProducto.name=req.body.name
		nuevoProducto.price=req.body.price
		nuevoProducto.discount=req.body.discount
		nuevoProducto.category=req.body.category
		nuevoProducto.description=req.body.description
		//res.send(nuevoProducto);
		products.push(nuevoProducto);
	
		let productosModificadosJson = JSON.stringify(products);
		fs.writeFileSync(productsFilePath, productosModificadosJson)
		res.redirect("/")
	}, 

	// Update - Form to edit
	edit: function(req, res, next) {
        
        let producto = products.find(function(element) {
            return element.id == req.params.id
        });
        
        
        res.render("product-edit-form", {
			title: producto.name,
            productoAEditar: producto,
            toThousand: toThousand
        })
        
    }, 
	// Update - Method to update
	update: function(req, res, next) {
		
        let productUpdate = []
        products.forEach(element=>{ 
        if(element.id==req.params.id) {
            element.name=req.body.name
            element.price=req.body.price
            element.discount=req.body.discount
            element.category=req.body.category
            element.description=req.body.description
            return productUpdate = element
        }
	})

    let productosModificadosJson = JSON.stringify(products);
    fs.writeFileSync(productsFilePath, productosModificadosJson)

    res.redirect("/");
},

	// Delete - Delete one product from DB
	destroy: (req, res) => {
		let productsQueQuedan = products.filter(function(element) {
			return element.id != req.params.id
		});
	
		let productosModificadosJson = JSON.stringify(productsQueQuedan);
		fs.writeFileSync(productsFilePath, productosModificadosJson)
	
		res.redirect("/");
	   
	
	},
};

module.exports = controller;