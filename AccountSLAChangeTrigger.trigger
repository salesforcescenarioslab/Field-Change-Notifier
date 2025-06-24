trigger AccountSLAChangeTrigger on Account (after update) {
    List<FieldChangeNotification__e> eventsToPublish = new List<FieldChangeNotification__e>();

    for (Account acc : Trigger.new) {
        Account oldAcc = Trigger.oldMap.get(acc.Id);

        if (acc.SLA__c != oldAcc.SLA__c) {
            FieldChangeNotification__e pe = new FieldChangeNotification__e(
                RecordId__c = acc.Id,
                New_SLA_Value__c = String.valueOf(acc.SLA__c)
            );
            eventsToPublish.add(pe);
        }
    }

    if (!eventsToPublish.isEmpty()) {
        EventBus.publish(eventsToPublish);
    }
}
