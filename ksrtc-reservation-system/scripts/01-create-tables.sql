-- Create tables and insert sample data for KSRTC reservation system

-- Insert sample customers
INSERT INTO customers (name, email, password, phone) VALUES
('Anoop Menon', 'anoop@example.com', '$2b$10$rOzWz8GH1YJ5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K', '9876543210'),
('Priya Nair', 'priya@example.com', '$2b$10$rOzWz8GH1YJ5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K', '8765432109'),
('Rajesh Kumar', 'rajesh@example.com', '$2b$10$rOzWz8GH1YJ5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K', '7654321098'),
('Meera Krishnan', 'meera@example.com', '$2b$10$rOzWz8GH1YJ5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K', '6543210987');

-- Insert sample buses
INSERT INTO buses (bus_number, capacity) VALUES
('KSRTC001', 40),
('KSRTC002', 50),
('KSRTC003', 45),
('KSRTC004', 35);

-- Insert sample routes
INSERT INTO routes (source, destination, distance) VALUES
('Trivandrum', 'Kochi', 200.5),
('Kochi', 'Kozhikode', 180.0),
('Kozhikode', 'Kannur', 95.5),
('Trivandrum', 'Kollam', 70.0),
('Kochi', 'Munnar', 130.0);

-- Insert sample schedules
INSERT INTO schedules (route_id, bus_id, departure_time, arrival_time, fare) VALUES
(1, 1, '2025-06-13 08:00:00', '2025-06-13 12:00:00', 500.00),
(2, 2, '2025-06-13 09:00:00', '2025-06-13 13:00:00', 750.00),
(3, 3, '2025-06-13 10:00:00', '2025-06-13 12:30:00', 400.00),
(4, 4, '2025-06-13 07:00:00', '2025-06-13 09:00:00', 300.00),
(5, 1, '2025-06-13 14:00:00', '2025-06-13 17:30:00', 600.00),
(1, 2, '2025-06-13 16:00:00', '2025-06-13 20:00:00', 500.00),
(2, 3, '2025-06-13 18:00:00', '2025-06-13 22:00:00', 750.00);

-- Insert sample payments
INSERT INTO payments (customer_id, amount, payment_date, payment_status, payment_method) VALUES
(1, 500.00, '2025-06-12 14:00:00', 'completed', 'credit_card'),
(2, 750.00, '2025-06-12 15:00:00', 'completed', 'debit_card'),
(3, 400.00, '2025-06-12 16:00:00', 'pending', 'upi');

-- Insert sample reservations
INSERT INTO reservations (customer_id, schedule_id, payment_id, reservation_date, status, seats_booked) VALUES
(1, 1, 1, '2025-06-12 14:30:00', 'confirmed', ARRAY['A1', 'A2']),
(2, 2, 2, '2025-06-12 15:30:00', 'confirmed', ARRAY['B1']),
(3, 3, 3, '2025-06-12 16:30:00', 'pending', ARRAY['C1', 'C2']);
