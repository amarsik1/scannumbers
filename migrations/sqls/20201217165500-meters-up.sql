create table address (
  address_id serial PRIMARY KEY,
  street_type_id integer not null ,
  street_Name varchar not null ,
  house_Number varchar not null ,
  apartment_Number integer,
  CONSTRAINT address_unique UNIQUE (street_Name, house_Number, apartment_Number)
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
  patronymic varchar not null
);

create table meters_group (
  meters_group_id serial  PRIMARY KEY,
  name varchar not null,
  consumer_id integer not null,
  address_id integer not null
);

create table meter (
  meter_id serial PRIMARY KEY,
  personal_account varchar not null,
  resource_type_id integer not null,
  organization_id integer not null,
  meters_group_id integer not null
);

CREATE TABLE meter_data (
  meter_data_id serial PRIMARY KEY,
  meter_id INTEGER NOT NULL,
  value INTEGER NOT NULL,
  date TIMESTAMP NOT NULL
);

-- ---
-- Foreign Keys
-- ---

alter TABLE address ADD FOREIGN KEY (street_type_id) REFERENCES street_type (street_type_id);
alter TABLE organization ADD FOREIGN KEY (resource_type_id) REFERENCES resource_type (resource_type_id);
alter TABLE organization ADD FOREIGN KEY (address_id) REFERENCES address (address_id);
alter TABLE meters_group ADD FOREIGN KEY (consumer_id) REFERENCES consumer (consumer_id);
alter TABLE meters_group ADD FOREIGN KEY (address_id) REFERENCES address (address_id);
alter TABLE meter ADD FOREIGN KEY (resource_type_id) REFERENCES resource_type (resource_type_id);
alter TABLE meter ADD FOREIGN KEY (organization_id) REFERENCES organization (organization_id);
alter TABLE meter ADD FOREIGN KEY (meters_group_id) REFERENCES meters_group (meters_group_id);
alter TABLE meter_data ADD FOREIGN KEY (meter_id) REFERENCES meter (meter_id);

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


 INSERT INTO street_type (name) VALUES
 ('square'),
 ('lane'),
 ('street');

 insert into resource_type (name) values
 ('gas'),
 ('electricity'),
 ('water'),
 ('heat');