import React from 'react';
import { Container, Typography, Button, Grid } from '@material-ui/core';
import { Link } from 'react-router-dom';
import CartItem from './CartItem/CartItem';
import useStyles from './styles';

const Cart = ({ cart, handleUpdateCartQty, handleRemoveFromCart, handleEmptyCart}) => {
    const classes = useStyles();

    const EmptyCart = () => (
        <Typography variant="subtitle1">You have no items in your shopping cart,
            start adding some!
            <Link to="/" className={classes.link}>start adding some!</Link>
        </Typography>
    );

    const FilledCart = () => (       
        <>

            <Grid container spacing={3}>
                
                {cart?.products?.map((item) => (
                    <Grid item xs={12} sm={4} key={item._id}>
                        <CartItem item={item} onUpdateCartQty={handleUpdateCartQty} onRemoveFromCart={handleRemoveFromCart} />
                    </Grid>
                ))}
            </Grid>
            <div className={classes.cardDetails}>
                <Typography variant="h4">
                    Subtotal: {cart.subtotal}
                </Typography>
                <div>
                    <Button className={classes.emptyButton} size="large" type="button" variant="contained" color="secondary" onClick={handleEmptyCart}>CheckOut</Button>
                </div>
            </div>
        </>
    );

    if (!cart) return 'Loading...';

    return (
    <Container>
        <div className={classes.toolbar} />
        <Typography className={classes.title} variant="h3">Your Shopping Cart</Typography>
        {(!cart || !cart.products || !cart.products.length) ? <EmptyCart /> : <FilledCart />}

    </Container>
    )
};

export default Cart;