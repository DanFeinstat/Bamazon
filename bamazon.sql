DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
    id int not null auto_increment,
    primary key (id),
    product_name varchar(100) not null,
    department_name varchar(100) default "general",
    price decimal(10,2) not null,
    stock_quantity int default 0
)

insert into(product_name, department_name, price, stock_quantity)values("apple", "produce",2.00, 50);
insert into(product_name, department_name, price, stock_quantity)values("orange", "produce",1.50,39);
insert into(product_name, department_name, price, stock_quantity)values("macbook pro","electronics",2999.06,42);
insert into(product_name, department_name, price, stock_quantity)values("AA batteries", "electronics", 9.99,4);
insert into(product_name, department_name, price, stock_quantity)values("pear", "produce", 2.50, 34);
insert into(product_name, department_name, price, stock_quantity)values("elephant piece", "meat", 8.56, 320);
insert into(product_name, department_name, price, stock_quantity)values("D batteries", "electronics", 9.99, 17);
insert into(product_name, department_name, price, stock_quantity)values("banana", "produce", 1.23, 52);
insert into(product_name, department_name, price, stock_quantity)values("2% milk", "dairy", 4.99, 13);
insert into(product_name, department_name, price, stock_quantity)values("greek yogurt", "diary", 6.59, 6);
