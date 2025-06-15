-- CreateTable
CREATE TABLE "tickets" (
    "ticket_id" SERIAL NOT NULL,
    "reservation_id" INTEGER NOT NULL,
    "ticket_no" TEXT NOT NULL,
    "seat_no" TEXT NOT NULL,
    "issue_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tickets_pkey" PRIMARY KEY ("ticket_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tickets_reservation_id_ticket_no_key" ON "tickets"("reservation_id", "ticket_no");

-- CreateIndex
CREATE UNIQUE INDEX "tickets_reservation_id_seat_no_key" ON "tickets"("reservation_id", "seat_no");

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_reservation_id_fkey" FOREIGN KEY ("reservation_id") REFERENCES "reservations"("reservation_id") ON DELETE CASCADE ON UPDATE CASCADE;
