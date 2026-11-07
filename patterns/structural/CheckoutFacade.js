import { InventoryService } from '../../services/InventoryService.js';
import { PaymentService } from '../../services/PaymentService.js';
import { ShippingService } from '../../services/ShippingService.js';

class CheckoutFacade {
    constructor() {
        this.inventoryService = new InventoryService();
        this.paymentService = new PaymentService();
        this.shippingService = new ShippingService();
    }

    placeOrder(orderDetails) {
        const { userId, productIds, shippingInfo } = orderDetails;
        const amount = 100; // giá trị giả lập vì orderDetails không có tổng tiền

        console.log('Starting checkout...');

        // Bước 1: kiểm tra tồn kho
        if (!this.inventoryService.checkStock(productIds)) {
            console.log('Checkout failed: some products are out of stock.');
            return false;
        }

        // Bước 2: thanh toán
        if (!this.paymentService.processPayment(userId, amount)) {
            console.log('Checkout failed: payment was declined.');
            return false;
        }

        // Bước 3: giao hàng
        const shipment = this.shippingService.arrangeShipping(userId, shippingInfo);
        if (!shipment) {
            console.log('Checkout failed: could not arrange shipping.');
            return false;
        }

        console.log(`Order placed successfully! Tracking ID: ${shipment.trackingId}`);
        return true;
    }
}

export { CheckoutFacade };
