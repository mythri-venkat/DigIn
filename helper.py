

def enum(**enums):
    return type('Enum', (), enums)

Orders = enum(ORDER_CREATED=1, ORDER_PROCESS=2, ORDER_FINISHED=3, ORDER_CANCEL=4)
