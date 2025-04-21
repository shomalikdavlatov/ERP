import PaymentsService from './../services/payments.service.js';

export default class PaymentsController {
    constructor() {
        this.service = new PaymentsService();
    }
    async createPaymentController(req, res) {
        try {
            const result = await this.service.createPayment(req.user.id, req.body);
            res.status(201).json(result);
        }
        catch (error) {
            if (!error.status) return res.status(500).json({ message: error.message });
            res.status(error.status).json({ message: error.message });
        }
    }
}