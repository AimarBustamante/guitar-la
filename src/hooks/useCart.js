import { useState, useEffect, useMemo } from "react";
import { db } from "../Data/db";

export const useCart = (params) => {
	const initialCart = () => {
		const localStorageCart = localStorage.getItem("cart");
		return localStorageCart ? JSON.parse(localStorageCart) : [];
	};

	const [data] = useState(db);
	const [cart, setCart] = useState(initialCart);

	useEffect(() => {
		localStorage.setItem("cart", JSON.stringify(cart));
	}, [cart]);

	function addToCart(item) {
		const itemExist = cart.findIndex((guitar) => guitar.id === item.id);
		if (itemExist >= 0) {
			// Existe en el carrito
			const updatedCart = [...cart];
			cart[itemExist].quantity++;
			setCart(updatedCart);
		} else {
			item.quantity = 1;
			setCart([...cart, item]);
		}
	}

	function removeFromCart(id) {
		setCart((prevCart) => prevCart.filter((guitar) => guitar.id !== id));
	}

	function increaseQuanty(id) {
		const updatedCart = cart.map((item) => {
			if (item.id === id && item.quantity < 5) {
				return {
					...item,
					quantity: item.quantity + 1,
				};
			}
			return item;
		});
		setCart(updatedCart);
	}

	function decreaseQuanty(id) {
		const updatedCart = cart.map((item) => {
			if (item.id === id && item.quantity > 1) {
				return {
					...item,
					quantity: item.quantity - 1,
				};
			}
			return item;
		});
		setCart(updatedCart);
	}

	function clearCart() {
		setCart([]);
	}

	function saveLocalStorage() {}

    // State derivado
	const isEmpty = useMemo(() => cart.length === 0, [cart]);
	const cartTotal = useMemo(() =>
		cart.reduce((total, item) => total + item.quantity * item.price, 0)
	);

	return {
		data,
		cart,
		addToCart,
		removeFromCart,
		increaseQuanty,
		decreaseQuanty,
		clearCart,
        isEmpty,
        cartTotal
	};
};
