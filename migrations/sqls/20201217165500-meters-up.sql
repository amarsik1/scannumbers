create table address (
  address_id serial PRIMARY KEY,
  street_type_id integer not null ,
  street_name varchar not null ,
  house_number varchar not null ,
  apartment_number varchar default 0,
  CONSTRAINT address_unique UNIQUE (street_name, house_number, apartment_number)
);

create table street_type (
  street_type_id serial PRIMARY KEY ,
  name varchar not null
);

create table organization (
  organization_id serial PRIMARY KEY,
  name varchar not null,
  resource_type_id integer not null,
  address_id integer not null,
  edrpou integer not null UNIQUE
);

create table resource_type (
  resource_type_id serial  PRIMARY KEY,
  name varchar not null
);

create table consumer (
  consumer_id serial PRIMARY KEY,
  name varchar not null,
  surname varchar not null,
  patronymic varchar not null,
  email varchar unique not null,
  password varchar not null
);

create table meters_group (
  meters_group_id serial  PRIMARY KEY,
  name varchar not null,
  consumer_id integer not null,
  address_id integer not null unique
);

create table meter (
  meter_id serial PRIMARY KEY,
  personal_account varchar not null,
  resource_type_id integer not null,
  organization_id integer not null,
  meters_group_id integer not null,
    CONSTRAINT meter_unique UNIQUE (resource_type_id, organization_id, meters_group_id)
);

create TABLE meter_data (
  meter_data_id serial PRIMARY KEY,
  meter_id INTEGER NOT NULL,
  value INTEGER NOT NULL,
  date TIMESTAMP NOT NULL
);

-- ---
-- Foreign Keys
-- ---

alter table address add FOREIGN KEY (street_type_id) REFERENCES street_type (street_type_id);
alter table organization add FOREIGN KEY (resource_type_id) REFERENCES resource_type (resource_type_id);
alter table organization add FOREIGN KEY (address_id) REFERENCES address (address_id);
alter table meters_group add FOREIGN KEY (consumer_id) REFERENCES consumer (consumer_id);
alter table meters_group add FOREIGN KEY (address_id) REFERENCES address (address_id);
alter table meter add FOREIGN KEY (resource_type_id) REFERENCES resource_type (resource_type_id);
alter table meter add FOREIGN KEY (organization_id) REFERENCES organization (organization_id);
alter table meter add FOREIGN KEY (meters_group_id) REFERENCES meters_group (meters_group_id);
alter table meter_data add FOREIGN KEY (meter_id) REFERENCES meter (meter_id);

-- ---
-- Table Properties
-- ---

-- ALTER TABLE address ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE streetType ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE organization ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE resourceType ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE consumer ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE metersGroup ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE meter ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;


 insert into street_type (name) values
 ('square'),
 ('lane'),
 ('street');

 insert into resource_type (name) values
 ('gas'),
 ('electricity'),
 ('water'),
 ('heat');