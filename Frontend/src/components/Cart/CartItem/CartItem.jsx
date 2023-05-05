import React from "react";
import { Typography, Button, Card, CardActions, CardContent, CardMedia } from "@material-ui/core";
import useStyles from "./styles";
const CartItem = ({ item, onUpdateCartQty, onRemoveFromCart }) => {

    const classes = useStyles();

    const handleUpdateClick = async (productId, newQuantity) => {
        console.log('Update button clicked with productId:', productId, 'and newQuantity:', newQuantity);
        await onUpdateCartQty(productId, newQuantity);
    };

    const handleRemoveClick = async (productId) => {
        console.log('Remove button clicked with productId:', productId);
        await onRemoveFromCart(productId);
    };

    return (
        <Card>
            <CardMedia image={item.image} alt={item.name} className={classes.media} />
            <CardContent className={classes.cardContent}>
                <Typography variant="h5">{item.title}</Typography>
                <Typography variant="h6">{item.price}</Typography>
            </CardContent>
            <CardActions className={classes.cardActions}>
                <div className={classes.buttons}>
                    <Button type="button" size="medium" onClick={(event) => { event.stopPropagation(); handleUpdateClick(item._id, item.quantity - 1); }}>-</Button>
                    <Typography>&nbsp;{item.quantity}&nbsp;</Typography>
                    <Button type="button" size="medium" onClick={(event) => { event.stopPropagation(); handleUpdateClick(item._id, item.quantity + 1); }}>+</Button>
                </div>
                <Button variant="contained" type="button" color="secondary" onClick={(event) => { event.stopPropagation(); handleRemoveClick(item._id); }}>Remove</Button>
            </CardActions>
        </Card>
    )
};

export default CartItem;