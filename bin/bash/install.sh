# Install RabbitMQ Module
#

# Flush Dynamic Directories
rm -rf .dynamic && mkdir .dynamic
rm -rf .dynamic/pid && mkdir .dynamic/pid
rm -rf .dynamic/log && mkdir .dynamic/log
rm -rf .dynamic/cache && mkdir .dynamic/cache

# Link Configuration Files
# ln -f static/etc/rabbitmq.config vendor/rabbitmq-3.2.0/etc/rabbitmq/rabbitmq.config
# ln -f static/etc/enabled_plugins vendor/rabbitmq-3.2.0/etc/rabbitmq/enabled_plugins
# ln -f static/etc/rabbitmq.config vendor/rabbitmq-3.2.0-mac/etc/rabbitmq/rabbitmq.config
# ln -f static/etc/enabled_plugins vendor/rabbitmq-3.2.0-mac/etc/rabbitmq/enabled_plugins
