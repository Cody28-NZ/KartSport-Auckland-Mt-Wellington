-- Phase 1 seed: option sets, products, placeholder terms

-- ---------------------------------------------------------------------------
-- Option sets
-- ---------------------------------------------------------------------------

insert into public.option_sets (key, label, description, is_system) values
  ('kart_classes', 'Kart classes', 'Competition classes at KartSport Auckland Mt Wellington', true),
  ('ksnz_licence_types', 'KSNZ licence types', 'KartSport New Zealand licence types', true),
  ('ksnz_licence_ratings', 'KSNZ licence ratings', 'KartSport New Zealand licence ratings', true),
  ('clubs', 'Clubs', 'Issuing / home clubs', true),
  ('volunteer_roles', 'Volunteer roles', 'Volunteer interest options for membership applications', true);

-- kart_classes
insert into public.option_values (option_set_id, value, label, sort_order)
select os.id, v.value, v.label, v.sort_order
from public.option_sets os
cross join (
  values
    ('cadet_rok', 'Cadet ROK', 1),
    ('vortex_mini_rok', 'Vortex Mini ROK', 2),
    ('rotax_max_junior', '125cc Rotax Max Junior', 3),
    ('akld_club_class_open', 'Akld Club Class Open', 4),
    ('rotax_max_light', '125cc Rotax Max Light', 5),
    ('rotax_max_heavy', '125cc Rotax Max Heavy', 6),
    ('rotax_dd2', 'Rotax DD2', 7),
    ('kz2', 'KZ2', 8),
    ('vortex_rok_dvs_senior', 'Vortex ROK DVS Senior', 9),
    ('club_sport_120', 'Club Sport 120', 10),
    ('vortex_rok_dvs_junior', 'Vortex ROK DVS Junior', 11)
) as v(value, label, sort_order)
where os.key = 'kart_classes';

-- ksnz_licence_types
insert into public.option_values (option_set_id, value, label, sort_order)
select os.id, v.value, v.label, v.sort_order
from public.option_sets os
cross join (
  values
    ('competition', 'Competition', 1),
    ('practice', 'Practice', 2),
    ('demonstration', 'Demonstration', 3)
) as v(value, label, sort_order)
where os.key = 'ksnz_licence_types';

-- ksnz_licence_ratings
insert into public.option_values (option_set_id, value, label, sort_order)
select os.id, v.value, v.label, v.sort_order
from public.option_sets os
cross join (
  values
    ('tier_1', 'Tier 1', 1),
    ('tier_2', 'Tier 2', 2),
    ('club_rated', 'Club Rated', 3),
    ('x_rated', 'X-Rated', 4),
    ('day', 'Day', 5)
) as v(value, label, sort_order)
where os.key = 'ksnz_licence_ratings';

-- clubs
insert into public.option_values (option_set_id, value, label, sort_order)
select os.id, v.value, v.label, v.sort_order
from public.option_sets os
cross join (
  values
    ('auckland', 'Auckland', 1),
    ('mt_wellington', 'Mt Wellington', 2),
    ('hamilton', 'Hamilton', 3),
    ('whangarei', 'Whangarei', 4),
    ('other', 'Other', 5)
) as v(value, label, sort_order)
where os.key = 'clubs';

-- volunteer_roles
-- TODO: Confirm exact volunteer dropdown values with the club before launch.
insert into public.option_values (option_set_id, value, label, sort_order)
select os.id, v.value, v.label, v.sort_order
from public.option_sets os
cross join (
  values
    ('flag_marshal', 'Flag marshal', 1),
    ('grid_marshal', 'Grid marshal', 2),
    ('scrutineering_help', 'Scrutineering help', 3),
    ('timing_help', 'Timing help', 4),
    ('pit_paddock_help', 'Pit/paddock help', 5),
    ('general_volunteer', 'General volunteer', 6),
    ('to_confirm', 'To confirm', 7)
) as v(value, label, sort_order)
where os.key = 'volunteer_roles';

-- ---------------------------------------------------------------------------
-- Membership products
-- ---------------------------------------------------------------------------

insert into public.membership_products (name, price, sort_order) values
  ('Racing / Practising Member', 110, 1),
  ('Additional Racing Member for Family, same address', 10, 2),
  ('Social Membership', 30, 3),
  ('Life / Honorary Member', 0, 4),
  ('Pit', 0, 5);

-- ---------------------------------------------------------------------------
-- Practice products
-- ---------------------------------------------------------------------------

insert into public.practice_products (name, price, sort_order) values
  ('KartSport AKL-MTW Members', 50, 1),
  ('Non KartSport AKL-MTW Members', 90, 2),
  ('School kids special condition', 25, 3);

-- ---------------------------------------------------------------------------
-- Race entry products
-- ---------------------------------------------------------------------------

insert into public.race_entry_products (name, price, sort_order) values
  ('Entry Fee', 95, 1),
  ('Transponder Hire', 20, 2),
  ('Saturday Night Security', 20, 3);

-- ---------------------------------------------------------------------------
-- Terms versions (placeholder - replace before launch)
-- ---------------------------------------------------------------------------

insert into public.terms_versions (context, version_label, title, body, active) values
  (
    'membership',
    'v1-placeholder',
    'Membership terms (placeholder)',
    'Terms text to be replaced with the approved KartSport Auckland Mt Wellington wording before launch.',
    true
  ),
  (
    'practice',
    'v1-placeholder',
    'Practice terms (placeholder)',
    'Terms text to be replaced with the approved KartSport Auckland Mt Wellington wording before launch.',
    true
  ),
  (
    'race_entry',
    'v1-placeholder',
    'Race entry terms (placeholder)',
    'Terms text to be replaced with the approved KartSport Auckland Mt Wellington wording before launch.',
    true
  );
