create table address (
  address_id serial PRIMARY KEY,
  street_type varchar not null ,
  street_name varchar not null ,
  city varchar not null ,
  house_number varchar not null ,
  apartment_number varchar default 0,
  CONSTRAINT address_unique UNIQUE (city, street_name, house_number, apartment_number)
);

create table organization (
  organization_id serial PRIMARY KEY,
  name varchar not null,
  resource_type varchar not null,
  address_id integer not null,
  edrpou varchar not null UNIQUE,
  FOREIGN KEY (address_id) REFERENCES address (address_id)
);

create table consumer (
  consumer_id serial PRIMARY KEY,
  name varchar not null,
  surname varchar not null,
  patronymic varchar not null,
  email varchar unique not null,
  pro boolean not null default FALSE,
  password varchar not null
);

create table meters_group (
  meters_group_id serial  PRIMARY KEY,
  name varchar not null,
  consumer_id integer not null,
  address_id integer not null unique,
  FOREIGN KEY (address_id) REFERENCES address (address_id),
  FOREIGN KEY (consumer_id)
    REFERENCES consumer (consumer_id)
    ON DELETE CASCADE
);

create table meter (
  meter_id serial PRIMARY KEY,
  personal_account varchar not null,
  name varchar not null,
  resource_type varchar not null,
  organization_id integer not null,
  meters_group_id integer not null
    -- CONSTRAINT meter_unique UNIQUE (resource_type, organization_id, meters_group_id),
    -- FOREIGN KEY (meters_group_id) REFERENCES meters_group (meters_group_id) ON DELETE CASCADE,
    -- FOREIGN KEY (organization_id) REFERENCES organization (organization_id),
    -- FOREIGN KEY (resource_type) REFERENCES resource_type (resource_type)
);

create TABLE meter_data (
  meter_data_id serial PRIMARY KEY,
  meter_id INTEGER NOT NULL,
  value INTEGER NOT NULL,
  date TIMESTAMP NOT NULL,
  FOREIGN KEY (meter_id) REFERENCES meter (meter_id) ON UPDATE CASCADE ON DELETE CASCADE
);
