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
insert into public.option_values (option_set_id, value, label, sort_order)
select os.id, v.value, v.label, v.sort_order
from public.option_sets os
cross join (
  values
    ('help_in_shop', 'Help in the shop', 1),
    ('working_bees', 'Come to Working bees', 2),
    ('committee', 'Committee', 3),
    ('officiate', 'Officiate', 4),
    ('starter', 'Starter', 5),
    ('sponsorship', 'Sponsorship', 6),
    ('clean_clubrooms', 'Clean the clubrooms', 7),
    ('permanent_flag_point', 'Permanent flag point', 8),
    ('cannot_help', 'Sorry, I can not help', 9)
) as v(value, label, sort_order)
where os.key = 'volunteer_roles';

-- ---------------------------------------------------------------------------
-- Membership products
-- ---------------------------------------------------------------------------

insert into public.membership_products (name, price, sort_order) values
  ('Racing / Practicing Member', 110, 1),
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
-- Terms versions
-- ---------------------------------------------------------------------------

update public.terms_versions set active = false where context = 'membership';

insert into public.terms_versions (context, version_label, title, body, active) values
  (
    'membership',
    '2025-26',
    'Membership Terms and Conditions 2025/26',
    $membership_terms$
INDEMNIFICATION and DECLARATION This is to certify that, I the undersigned submit this application to become a member of KartSport Auckland-Mt Wellington Inc for the 2025/26 year & to compete in KartSport Auckland-Mt Wellington race & practice days (official & unofficial) at the Rosebank Rd Domain up until 31 March 2026.
I acknowledge & agree to accept as a condition of entry that the FIA-CIK; MotorSport NZ; KartSport NZ; KartSport Auckland-Mt Wellington Inc; Auckland City Council; Power Sport Ass; all sponsors & all or any members, officials, or assistants of any of the above named & or known organisations, or their respective servants, officials, representatives, or agents shall not be under any liability whatsoever for any death or bodily injury, loss or damage which may be sustained or incurred as a result of my participation in the race meeting or event, howsoever such death or bodily injury, loss or damage is caused, notwithstanding that such death, injury, loss or damage may have been contributed to or caused by the negligence of the inviting club or KartSport New Zealand or any of their respective officials, servants, representatives or agents, or by any other person.
I declare I apply for a Drivers Membership I have a current KartSport New Zealand Competition licence or Kartsport New Zealand Practice licence with a rating applicable to the class entered. (Ratings will not be valid unless they have been dated 10 days prior to the start of the event).
I declare I am conversant with & will abide by all current KartSport New Zealand rules, regulations, codes and specifications governing kart racing; and that I will abide by any supplementary rules which & apply & the directions & rulings of the Chief Steward of the day without losing my right to protest or appeal.
I declare that I will comply with all current Health & Safety rules of KartSport Auckland and Kartsport New Zealand.
I declare that I have no medical condition that may impede my ability to drive a kart in competition or practice. I declare that my kart & driving apparel will comply with all current KartSport New Zealand Rules & Specifications throughout this event.
I declare that at or prior to any event, be suffering from any disability of any kind, whether permanent or temporary, which is likely to detrimentally affect my control of my kart or my fitness to drive, I will not participate.
I declare that I will not make use of drugs or of prohibited methods such as are defined by the Intoxicating Liquor & Drug regulations of KartSport New Zealand.
I declare that I give consent to the details contained on this entry form being held by KartSport New Zealand and/or the Organising Club for the purpose of the promotion & benefit of the event concerned & KartSport in general.
I acknowledge my right to access & correct of this information. This consent is given in accordance with the Privacy Act 1993.
Minors, under 18, must have a parent's or legal guardian's approve the conditions of entry and declaration. A parent or legal guardian accepting the terms on behalf of a minor must attend driver's briefing & be in attendance during the course of all competition and official practice & should the competitor choose not to represent him/herself be the only person to represent the competitor at any judicial hearing.
I consent to the collection of the details below by KartSport Auckland Inc. for the purpose of a membership record & for KartSport Auckland Inc. to retain & disclose these to KartSport New Zealand Inc, SPARC, funding agencies & sponsors. I acknowledge my right to access & correction of this information. This consent is given in accordance with the Privacy Act 1993.
$membership_terms$,
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
