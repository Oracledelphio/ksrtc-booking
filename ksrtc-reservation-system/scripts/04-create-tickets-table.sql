-- Create tickets table as a weak entity set
CREATE TABLE tickets (
    ticket_id SERIAL PRIMARY KEY,
    reservation_id INTEGER NOT NULL REFERENCES reservations(reservation_id) ON DELETE CASCADE,
    ticket_no VARCHAR(20) NOT NULL,
    seat_no VARCHAR(10) NOT NULL,
    issue_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Composite unique constraints for weak entity
    UNIQUE (reservation_id, ticket_no),
    UNIQUE (reservation_id, seat_no)
);

-- Create index for better performance
CREATE INDEX idx_tickets_reservation_id ON tickets(reservation_id);

-- Insert sample tickets for existing reservations
-- Reservation 1: Customer 1, Seats A1, A2
INSERT INTO tickets (reservation_id, ticket_no, seat_no, issue_date) VALUES
(1, 'T001', 'A1', '2025-06-12 14:35:00'),
(1, 'T002', 'A2', '2025-06-12 14:35:00');

-- Reservation 2: Customer 2, Seat B1
INSERT INTO tickets (reservation_id, ticket_no, seat_no, issue_date) VALUES
(2, 'T001', 'B1', '2025-06-12 15:35:00');

-- Reservation 3: Customer 3, Seats C1, C2
INSERT INTO tickets (reservation_id, ticket_no, seat_no, issue_date) VALUES
(3, 'T001', 'C1', '2025-06-12 16:35:00'),
(3, 'T002', 'C2', '2025-06-12 16:35:00');
