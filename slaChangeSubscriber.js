// Import necessary modules from LWC and Lightning services
import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { subscribe, unsubscribe, onError } from 'lightning/empApi';

export default class SlaChangeSubscriber extends LightningElement {
    // Expose recordId to identify the current Account record
    @api recordId;

    // Name of the Platform Event channel to subscribe to
    channelName = '/event/FieldChangeNotification__e';

    // Stores the subscription reference for unsubscribing later
    subscription = {};

    // Used to track the previously received value and avoid duplicate toasts
    previousValue;

    // Called when the component is inserted into the DOM
    connectedCallback() {
        this.handleSubscribe();           // Start listening for platform events
        this.registerErrorListener();     // Register error listener
    }

    // Called when the component is removed from the DOM
    disconnectedCallback() {
        this.handleUnsubscribe();         // Unsubscribe from the channel
    }

    // Subscribes to the Platform Event and handles incoming events
    handleSubscribe() {
        // Callback function that gets triggered on each event
        const messageCallback = (response) => {
            const payload = response.data.payload;

            // Ensure we have valid payload and recordId
            if (payload && payload.RecordId__c && this.recordId) {
                // Salesforce sometimes appends suffixes — use startsWith for safe matching
                if (payload.RecordId__c.startsWith(this.recordId)) {
                    const currentValue = payload.New_SLA_Value__c;

                    // Avoid duplicate toasts for the same value
                    if (currentValue !== this.previousValue) {
                        // Show a toast notification to the user
                        this.showToast(
                            'SLA Changed',
                            'You have changed the SLA value. Please verify this update carefully.',
                            'warning'
                        );

                        // Update previous value to prevent repeated notifications
                        this.previousValue = currentValue;
                    }
                }
            }
        };

        // Subscribe to the event channel using EMP API
        subscribe(this.channelName, -1, messageCallback)
            .then(response => {
                this.subscription = response;
            })
            .catch(error => {
                console.error('Subscription error:', JSON.stringify(error));
            });
    }

    // Gracefully unsubscribe when the component is destroyed
    handleUnsubscribe() {
        if (this.subscription && this.subscription.id) {
            unsubscribe(this.subscription, () => {});
        }
    }

    // Registers a listener to catch any EMP API errors
    registerErrorListener() {
        onError(error => {
            console.error('Platform Event Error:', JSON.stringify(error));
        });
    }

    // Helper method to display a toast message
    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({
            title,
            message,
            variant
        }));
    }
}
