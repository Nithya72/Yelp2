drop database if exists yelp;
create database yelp;
use yelp;

create table Customers (
   CustomerId integer not null AUTO_INCREMENT,
   CustName varchar(20),
   CustEmailId varchar(30),
   CustomerPhoneNo varchar(15),
   CustPassword varchar(50),
   CustPic varchar(30) default 'avatar',
   YelpingSince varchar(15),
   ThingsLove varchar(50) default 'You have not told us yet ... do tell!',
   FindMeIn varchar(30),
   MyBlog varchar(30),
   CustomerDOB varchar(10),
   CustomerCity varchar(20),
   CustomerState varchar(10),
   CustomerCountry varchar(20),
   NickName varchar(15),
   Headline varchar(50),
   FriendsCount integer default 0,
   ReviewsCount integer default 0,
   PhotosCount integer default 0,
   primary key(CustomerId)
);

create table Restaurants (
   RestaurantId integer not null AUTO_INCREMENT,
   RestName varchar(50),
   RestEmailId varchar(30),
   RestPassword varchar(50),
   RestPhoneNo varchar(15),
   Location varchar(20),
   RestTimings varchar(20),
   Cuisine varchar(10),
   Description varchar(1000),
   Rating decimal(10,1) default 5.0,
   NumOfReviews integer,
   Review1 varchar(1000),
   Review2 varchar(500),
   Review3 varchar(500),
   IsCurbPickUp varchar(1),
   IsDineIn varchar(1),
   IsYelpDelivery varchar(1),
   Latitude varchar(30), 
   Longitude varchar(30),
   ImageSrc varchar(30) default 'default',
   ProfilePic varchar(30) default 'avatar',
   primary key(RestaurantId)
);


create table Dishes (
	DishId integer not null AUTO_INCREMENT,
    DishName varchar(15),
    DishPrice decimal(10,2),
    Cuisine varchar(10),
    DishImg varchar(15) default 'default1',
    DishMainIngd varchar(30),
    DishCategory varchar(12),
    primary key(DishId)
);

create table Menu(
	MenuId integer not null AUTO_INCREMENT,
    DishId integer,
    RestaurantId integer,
    primary key(MenuId),
    foreign key(DishId) references Dishes(DishId) ON DELETE SET NULL,
    foreign key(RestaurantId) references Restaurants(RestaurantId) ON DELETE SET NULL
);


create table Orders(
	OrderId integer not null AUTO_INCREMENT,
    OrderAmount decimal(10,2),
    OrderDate date,
    OrderDishes varchar(100),
    OrderTime timestamp,
    RestaurantId integer,
    RestaurantName varchar(50),
    CustomerId integer,
    OrderStatus varchar(30),
    DeliveryOption varchar(20),
    primary key(OrderId),
    foreign key(RestaurantId) references Restaurants(RestaurantId) ON DELETE CASCADE,
    foreign key(CustomerId) references Customers(CustomerId) ON DELETE CASCADE
);


create table Events(
	EventId integer not null auto_increment,
    EventName varchar(150),
    EventDay varchar(10),
    EventDate Date,
    EventTime varchar(18),
    EventContactNo varchar(15),
    EventPlace varchar(50),
    EventCity varchar(30),
    EventPrice varchar(7),
    EventDescription varchar(500),
    EventType varchar(15),
    EventWhatWhy varchar(600),
	EventLatitude varchar(30), 
	EventLongitude varchar(30),
    primary key(EventId)
);

create table Registration(
	RegistrationId integer not null auto_increment,
    RegCustomerId integer,
    RegEventId integer,
    primary key(RegistrationId),
	foreign key(RegEventId) references Events(EventId) ON DELETE CASCADE,
    foreign key(RegCustomerId) references Customers(CustomerId) ON DELETE CASCADE
);

INSERT INTO Events VALUES ('1', 'Yelp KITs Available in the Peninsula', 'Saturday', '2020-10-31', '09:00 am - 7:00 pm', '(408) 842-9911', 'City of San Mateo', 'San Mateo, CA', 'Free', 'If you have done every jigsaw puzzle and baked your 100th loaf of sourdough, listen up: we have teamed up with local businesses to offer Yelp KITs for grab & go enjoyment at home!', 'Food & Drink', 'Just FYI: Yelp KITs are available for purchase directly from the businesses below from August 10th - October 10th. K.I.T. with awesome local spots in your area by grabbing a Yelp KIT today!', '37.547423', '-122.315213');

INSERT INTO Events VALUES ('2', 'The South Bay #LocalAdventureChallenge', 'Sunday', '2020-10-18', '10:00 am - 5:00 pm', '(669) 842-9911', 'Locations Across South Bay', 'San Jose, CA', '20.00', 'Join us for Yelp South Bay first #LocalAdventureChallenge! It is a list of 30 challenges and must-do local experiences curated by the Yelp Elite Squad.', 'Other', 'In partnership with The Fire Response Fund at Community Foundation Santa Cruz County, which was created to address the mid and long-term needs of Santa Cruz County to recover and rebuild from the devastating fires that have struck our community this August.', '37.389711', '-121.931000');

INSERT INTO Events VALUES ('3', 'Shannon Wright "Number Crunchers" Art Kiosk Installation', 'Monday', '2020-10-05', '10:00 am - 5:00 pm', '(608) 842-9911', 'Courthouse Square', 'Redwood City, CA', '70.00', 'The Redwood City Improvement Association, in partnership with Fung Collaboratives, has unveiled the latest Art Kiosk Installation exhibit by interdisciplinary artist, Shannon Wright.', 'Visual Arts', 'You can view this exhibit 24/7 from the Art Kiosk windows starting October 05. When viewing the exhibit through the windows, please remember to practice social distancing by staying at least six feet away and wearing a mask.', '37.486869', '-122.229281');


INSERT INTO Restaurants (RestaurantId, RestName, RestEmailId, RestPassword, Location, Cuisine, IsCurbPickUp, IsDineIn, IsYelpDelivery, Latitude, Longitude, Rating, NumOfReviews, ImageSrc, RestPhoneNo, RestTimings, ProfilePic) 
VALUES ('1','Chick-fil-A','chickfila@gmail.com','123','Buena Vista','American','N','Y','Y','37.3520','-121.9585','3.9','2845', 'chick', '+1 9988764293', '09:00 AM - 9:00 PM', 'chick');

INSERT INTO Restaurants (RestaurantId, RestName, RestEmailId, RestPassword, Location, Cuisine, IsCurbPickUp, IsDineIn, IsYelpDelivery, Latitude, Longitude, Rating, NumOfReviews, ImageSrc, RestPhoneNo, RestTimings, ProfilePic) 
VALUES ('2','In-N-Out Burger','innout@gmail.com','123','Willow Glen','American','Y','N','N','37.394649', '-121.963301','3.3','457', 'innout', '+1 6789253627', '10:00 AM - 11:59 PM', 'innout');

INSERT INTO Restaurants (RestaurantId, RestName, RestEmailId, RestPassword, Location, Cuisine, IsCurbPickUp, IsDineIn, IsYelpDelivery, Latitude, Longitude, Rating, NumOfReviews, ImageSrc, RestPhoneNo, RestTimings, ProfilePic) 
VALUES ('3','The Habit Burger','habit@gmail.com','123','North San Jose','American','Y','N','N','37.386822', '-121.890573','4.1','1774', 'habit', '+1 9678237392', '8:30 AM - 9:30 PM', 'habit');

INSERT INTO Restaurants (RestaurantId, RestName, RestEmailId, RestPassword, Location, Cuisine, IsCurbPickUp, IsDineIn, IsYelpDelivery, Latitude, Longitude, Rating, NumOfReviews, ImageSrc, RestPhoneNo, RestTimings, ProfilePic) 
VALUES ('4','The Cheesecake Factory','cheesecake@gmail.com','ff52322467e4f51d34389d17533b6bb9','North San Jose','Italian','N','Y','Y','37.324367','-121.946980','4.2','785', 'cheesecake', '+1 9876541230', '10:00 AM - 10:00 PM', 'cheesecake');

INSERT INTO Restaurants (RestaurantId, RestName, RestEmailId, RestPassword, Location, Cuisine, IsCurbPickUp, IsDineIn, IsYelpDelivery, Latitude, Longitude, Rating, NumOfReviews, ImageSrc, RestPhoneNo, RestTimings, ProfilePic) 
VALUES ('5','A Bellagio Italian Restaurant','bellagio@gmail.com','123','Buena Vista','Italian','Y','N','N', '37.286632', '-121.943388','3.7','754', 'bellagio', '+1 9852316479', '09:00 AM - 10:30 PM', 'bellagio');

INSERT INTO Restaurants (RestaurantId, RestName, RestEmailId, RestPassword, Location, Cuisine, IsCurbPickUp, IsDineIn, IsYelpDelivery, Latitude, Longitude, Rating, NumOfReviews, ImageSrc, RestPhoneNo, RestTimings, ProfilePic) 
VALUES ('6','II Fornaio','fornaio@gmail.com','123','Willow Glen','Italian','N','Y','N','37.381329', '-121.976774','4.0','544', 'fornaio', '+1 6699334488', '09:30 AM - 11:30 PM',  'fornaio');

     
INSERT INTO Dishes (DishId, DishName, DishPrice, Cuisine, DishMainIngd, DishCategory) VALUE ('1','Burger','3.49','American', 'Meat, Onion, Lettucs', 'Appetizer');
INSERT INTO Dishes (DishId, DishName, DishPrice, Cuisine, DishMainIngd, DishCategory) VALUE ('2','Chicken Wings','2.79','American', 'Chicken, BBQ Sauce', 'Main Course');
INSERT INTO Dishes (DishId, DishName, DishPrice, Cuisine, DishMainIngd, DishCategory) VALUE ('3','Fries','1.99','American', 'Potato', 'Appetizer');
INSERT INTO Dishes (DishId, DishName, DishPrice, Cuisine, DishMainIngd, DishCategory) VALUE ('4','Pasta','13.49','Italian', 'Pasta, Sauce', 'Main Course');
INSERT INTO Dishes (DishId, DishName, DishPrice, Cuisine, DishMainIngd, DishCategory) VALUE ('5','Tiramisu','6.49','Italian', 'Sugar, Honey', 'Desserts');
INSERT INTO Dishes (DishId, DishName, DishPrice, Cuisine, DishMainIngd, DishCategory) VALUE ('6','Pizza','12.99','Italian', 'Sauce, Toppings', 'Main Course');
INSERT INTO Dishes (DishId, DishName, DishPrice, Cuisine, DishMainIngd, DishCategory) VALUE ('7','Salad','4.99','Italian', 'Lettuce, Veggies', 'Salad');
    
    
INSERT INTO Menu (MenuId, DishId, RestaurantId) VALUE ('1', '2', '1');
INSERT INTO Menu (MenuId, DishId, RestaurantId) VALUE ('2', '3', '1');
INSERT INTO Menu (MenuId, DishId, RestaurantId) VALUE ('3', '1', '1');
INSERT INTO Menu (MenuId, DishId, RestaurantId) VALUE ('4', '2', '2');
INSERT INTO Menu (MenuId, DishId, RestaurantId) VALUE ('5', '3', '2');
INSERT INTO Menu (MenuId, DishId, RestaurantId) VALUE ('6', '1', '2');
INSERT INTO Menu (MenuId, DishId, RestaurantId) VALUE ('7', '2', '3');
INSERT INTO Menu (MenuId, DishId, RestaurantId) VALUE ('8', '3', '3');
INSERT INTO Menu (MenuId, DishId, RestaurantId) VALUE ('9', '3', '4');
INSERT INTO Menu (MenuId, DishId, RestaurantId) VALUE ('10', '4','4');

INSERT INTO Menu (MenuId, DishId, RestaurantId) VALUE ('11', '5', '4');

INSERT INTO Menu (MenuId, DishId, RestaurantId) VALUE ('12', '6', '4');
INSERT INTO Menu (MenuId, DishId, RestaurantId) VALUE ('13', '7', '4');
INSERT INTO Menu (MenuId, DishId, RestaurantId) VALUE ('14', '4', '5');
INSERT INTO Menu (MenuId, DishId, RestaurantId) VALUE ('15', '5', '5');
INSERT INTO Menu (MenuId, DishId, RestaurantId) VALUE ('16', '4', '6');
INSERT INTO Menu (MenuId, DishId, RestaurantId) VALUE ('17', '5', '6');
INSERT INTO Menu (MenuId, DishId, RestaurantId) VALUE ('18', '6', '6');


UPDATE Restaurants
SET Description = 'As we navigate the evolving impact of coronavirus on our communities, we are temporarily closing our dining
room seating to help limit person-to-person contact. Some of our restaurants may only offer service through
our drive-thrus, while others may be able to offer takeout, delivery or mobile order options.'
WHERE RestaurantId = 1;

UPDATE Restaurants
SET Description = 'The food is always really good and the customer service is exceptional. The food always is ready super quick even in the delivery lane.'
WHERE RestaurantId = 2;

UPDATE Restaurants
SET Description = 'One bite of a hot, juicy Charburger and suddenly you are in Santa Barbara, California, 1969. After all, it was in that picturesque, coastal Southern California town that the original Habit Burger Grill opened its doors. '
WHERE RestaurantId = 3;

UPDATE Restaurants
SET Description = 'Super easy curb-side pick up! We got fettuccini Alfredo with shrimp for dinner. It was sooo good! We also got an Oreo Dream Extreme Cheesecake. It is super sweet and delicious!'
WHERE RestaurantId = 4;

UPDATE Restaurants
SET Description = 'A Bellagio specializes in fresh high quality ingredients, sourced locally or from italian producers. We strive to
give every guest a unique experience that exceeds their expectations.'
WHERE RestaurantId = 5;

UPDATE Restaurants
SET Description = 'Step inside Il Fornaio and take an award-winning culinary journey through Italy. Specialties include house made pastas, wood-fired pizza, grilled fish, authentic risotto, and rotisserie meats. '
WHERE RestaurantId = 6;

/* ----------------------------------------------- */

INSERT INTO Customers (CustomerId, CustName, CustEmailId, CustPassword, YelpingSince, CustomerCity, CustomerState, NickName, Headline, FriendsCount, ReviewsCount, PhotosCount, CustomerCountry) 
VALUES ('1','Nithya Anbalagan','nithya.anbalagan2@gmail.com', 'fe2ae53774ab6ff33b874e5d1f4691e1', 'December 2018', 'San Jose', 'CA', 'Nithu', 'Conquering the world one bite at a time', '234', '58', '14', 'United States');


INSERT INTO Customers (CustomerId, CustName, CustEmailId, CustPassword, YelpingSince, CustomerCity, CustomerState, NickName, Headline, FriendsCount, ReviewsCount, PhotosCount, CustomerCountry) 
VALUES ('2','Pradeep Kumar Mani','pradeep123js@gmail.com', 'fe2ae53774ab6ff33b874e5d1f4691e1', 'March 2016', 'San Jose', 'CA', 'Pradeep', 'Conquering the world one bite at a time', '431', '97', '52', 'United States');


/* ----------------------------------------------- */

UPDATE Restaurants
SET Review1 = 'As usual, we are happy customers. We placed our order through the website and we drove off for pick up! We arrived maybe 5 minutes late after our suggested pick up time. The food was cold by the time we got it home. It is sad, but probably a lot safer to eat cold food in the comfort of your own home. Thanks for working! Food was as usual, pretty good quality! We both ordered our steaks medium rare, but different pieces were closed to medium well. We liked that the to go order also come with bread and butter! You can never have enough of that! :)'
WHERE RestaurantId = 4;

UPDATE Restaurants
SET Review2 = 'I applaud Jason for his problem solving skills and ability to keep things under control despite the pressure and stress from confused and hungry customers. Jason and his team sprinted back and forth to get orders to customers as soon as possible. Some customers were irrate and uncooperative. But, Jason led his team to provide the best customer service possible.Thank you Jason!'
WHERE RestaurantId = 4;

UPDATE Restaurants
SET Review3 = 'Even in covid this place had very good service. They care about their customers a lot. The atmosphere is nice and they have a wide variety of food. I really recommend this place.'
WHERE RestaurantId = 4;