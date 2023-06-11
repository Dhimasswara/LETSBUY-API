create table users (
    id_user varchar(255) primary key,
    fullname varchar(255) not null,
    email varchar(255) not null,
    password varchar(255) not null
)

create table product (
    id_products varchar primary key,
    name varchar(255) not null,
    stock int not null,
    buy_price int not null,
    sell_price int not null,
    photo varchar(255) not null
);
