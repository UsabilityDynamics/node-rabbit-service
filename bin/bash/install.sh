# Install RabbitMQ Module
#

# Link Configuration Files
ln -f static/etc/rabbitmq.config vendor/rabbitmq-3.2.0/etc/rabbitmq/rabbitmq.config
ln -f static/etc/enabled_plugins vendor/rabbitmq-3.2.0/etc/rabbitmq/enabled_plugins
ln -f static/etc/rabbitmq.config vendor/rabbitmq-3.2.0/etc/rabbitmq/rabbitmq-env.conf

# Create Directories
mkdir .dynamic
mkdir .dynamic/pid
mkdir .dynamic/cache

# Link Binaries
# ln -f vendor/rabbitmq-3.2.0/sbin/rabbitmq-defaults bin/rabbitmq-defaults
# ln -f vendor/rabbitmq-3.2.0/sbin/rabbitmq-env bin/rabbitmq-env
# ln -f vendor/rabbitmq-3.2.0/sbin/rabbitmq-server bin/rabbitmq-server
# ln -f vendor/rabbitmq-3.2.0/sbin/rabbitmq-plugins bin/rabbitmq-plugins
# ln -f vendor/rabbitmq-3.2.0/sbin/rabbitmqctl bin/rabbitmqctl
